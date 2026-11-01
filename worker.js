const COLS=['Email','Telefon','Facebook_ID','Jmeno','Prijmeni','Pohlavi','Bydliste','Mesto','Rodinny_stav','Zamestnani','Info1','Info2','Info3'];
let cancelled=false;
self.onmessage = async e => {
  if (e.data.type === 'cancel') { cancelled = true; return; }
  if (e.data.type === 'parse') {
    cancelled = false;
    try { await parseFile(e.data.file); }
    catch (err) { self.postMessage({type:'error', message:err && err.message ? err.message : String(err)}); }
  }
};
function makeRow(fields,id) {
  const obj={id};
  for(let i=0;i<COLS.length;i++) obj[COLS[i]]=String(fields[i]??'').trim();
  return obj;
}
async function* chunks(file, size=1024*1024) {
  if (file.stream && typeof file.stream === 'function') {
    const reader=file.stream().getReader();
    try {
      while(true) {
        const {value,done}=await reader.read();
        if(done) break;
        yield value;
        if(cancelled) return;
      }
    } finally { try { reader.releaseLock(); } catch {} }
  } else {
    for(let offset=0; offset<file.size; offset+=size) {
      if(cancelled) return;
      const blob=file.slice(offset,Math.min(file.size,offset+size));
      const buf=await blob.arrayBuffer();
      yield new Uint8Array(buf);
    }
  }
}
async function parseFile(file) {
  const decoder=new TextDecoder('utf-8',{fatal:false});
  let row=[],field='',quoted=false,first=true,id=1,batch=[],bytes=0,carry='';
  const total=Math.max(1,file.size);
  const pushField=()=>{row.push(field);field='';};
  const flush=()=>{
    if(batch.length) {
      self.postMessage({type:'batch',rows:batch,progress:Math.min(.99,bytes/total)});
      batch=[];
    }
  };
  const pushRow=()=>{
    pushField();
    if(first){first=false;row=[];return;}
    if(row.length) {
      batch.push(makeRow(row,id++));
      if(batch.length>=400) flush();
    }
    row=[];
  };
  const consume=(input,eof=false)=>{
    const s=carry+input; carry='';
    for(let i=0;i<s.length;i++) {
      const ch=s[i];
      if(quoted) {
        if(ch==='"') {
          if(i+1<s.length && s[i+1]==='"') { field+='"'; i++; }
          else if(i+1===s.length && !eof) { carry='"'; break; }
          else quoted=false;
        } else field+=ch;
      } else {
        if(ch==='"' && field.length===0) quoted=true;
        else if(ch===',') pushField();
        else if(ch==='\n') pushRow();
        else if(ch!=='\r') field+=ch;
      }
    }
  };
  for await (const chunk of chunks(file)) {
    if(cancelled) return;
    bytes+=chunk.byteLength;
    consume(decoder.decode(chunk,{stream:true}),false);
    flush();
  }
  if(cancelled) return;
  consume(decoder.decode(),true);
  if(field.length || row.length) pushRow();
  flush();
  self.postMessage({type:'done',total:id-1});
}
