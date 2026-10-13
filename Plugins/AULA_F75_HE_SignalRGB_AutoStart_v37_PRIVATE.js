export function Name(){return 'AULA F75 HE - Auto Start v37 (PRIVATE)';}
export function Publisher(){return 'magichornet438 (community experimental plugin)';}
export function VendorId(){return 0x38A6;}
export function ProductId(){return 0x2729;}
export function Type(){return 'hid';}
export function Size(){return [17,6];}
export function DefaultPosition(){return [100,30];}
export function DefaultScale(){return 5;}
const names=["ESC","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","` ~","!1","@2","#3","$4","%5","^6","&7","*8","(9",")0","_-","+=","Back Space","Del","Tab","Q","W","E","R","T","Y","U","I","O","P","{[","}]","|\\","PgUp","CapsLock","A","S","D","F","G","H","J","K","L",":;","LED 59","Enter","PgDn","L-Shift","Z","X","C","V","B","N","M","<,",">.","?/","R-Shift","↑","End","L-Ctrl","L-Win/CMD","L-Alt/CPT","Space","Fn","R-Ctrl/CPT","←","↓","→"];
const positions=[[0,0],[2,0],[3,0],[4,0],[5,0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[13,0],[14,0],[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],[12,1],[13,1],[16,1],[0,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],[13,2],[14,2],[16,2],[0,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3],[12,3],[13,3],[16,3],[0,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],[12,4],[13,4],[15,4],[16,4],[0,5],[2,5],[3,5],[5,5],[10,5],[12,5],[14,5],[15,5],[16,5]];
const ledIDs=[0,1,2,3,4,5,6,7,8,9,10,11,12,16,17,18,19,20,21,22,23,24,25,26,27,28,92,106,32,33,34,35,36,37,38,39,40,41,42,43,44,60,105,48,49,50,51,52,53,54,55,56,57,58,59,76,108,64,65,66,67,68,69,70,71,72,73,74,75,90,107,80,81,82,83,85,87,88,89,91];
export function LedNames(){return names;}
export function LedPositions(){return positions;}
export function Validate(ep){return ep.interface===2&&ep.usage_page===0xFF68&&ep.usage===0x0061;}


// PRIVATE v37 auto-start candidate. Based on physically tested v36.
// USB protocol, frame pacing, ACK validation, key map, v33 Esc fix,
// static keepalive, and fault lock remain unchanged.
// SignalRGB samples per-key RGB from its canvas: all effects are supported.
// WARNING: Earlier experimental protocols caused repeating/stuck inputs.
// Auto-start is newly changed and NOT yet physically tested. Save work and
// supervise first boot. OFF and Shutdown stop writes but do not restore OEM RGB.
const OFF='OFF - no USB writes (select first)';
const LIVE='LIVE - follow SignalRGB effects (no time limit)';
// Wait for SignalRGB and the keyboard to settle after Initialize before any write.
const STARTUP_SETTLE_MS=3000;
const MIN_FRAME_START_MS=70;
// The keyboard may revert to its onboard rainbow when no RGB packets arrive.
// Keep the same six ACK-verified packets alive at low frequency for static effects.
const STATIC_KEEPALIVE_MS=750;
const MAX_FRAME_WATCHDOG_MS=300;
const FRAME_PACKETS=6;
export function ControllableParameters(){
  // Keep the exact v36 option strings to recognize previously saved LIVE/OFF selections.
  // Default LIVE on new installs; a user who saves OFF stays OFF on restart.
  return [{property:'syncMode',label:'AULA RGB mode - LIVE auto-starts on boot',type:'combobox',
    values:[OFF,LIVE],default:LIVE}];
}
let previousMode=null,phase='idle',lastFrameStart=0,lastFrame=null;
let frames=0,packets=0,healthFrames=0,healthPackets=0,healthAt=0;
let shutdown=false,firstAck=false,faulted=false,startupAt=0;
let keepalives=0;
function log(s){device.log('[F75HE-AUTO-v37] '+s,{toFile:true});}
function resetCounts(now){frames=0;packets=0;healthFrames=0;healthPackets=0;healthAt=now;
  lastFrame=null;lastFrameStart=0;firstAck=false;keepalives=0;}
export function Initialize(){
  previousMode=null;phase='idle';shutdown=false;faulted=false;
  startupAt=Date.now();resetCounts(startupAt);
  device.setName('AULA F75 HE (Private Auto Start v37)');
  log('Boot: LIVE auto-start enabled if selected. Wait 3000ms before first RGB packet. OFF stays OFF; errors lock further writes. Input safety not proven for long term.');
}
export function onsyncModeChanged(){log('Control requested: '+String(syncMode));}
function stop(reason){
  if(phase==='running')log('STOP: '+reason+'; USB WRITES DISABLED and SAFETY LOCKED until device/plugin restart. If keyboard input changes, quit SignalRGB and unplug/reconnect keyboard.');
  faulted=true;phase='stopped';lastFrame=null;
}
function clamp(v){const n=Number(v);if(!Number.isFinite(n))throw new Error('Bad RGB sample');
  return Math.max(0,Math.min(255,Math.round(n)));}
function samplePacked(){
  const f=new Array(336).fill(0);
  if(names.length!==80||positions.length!==80||ledIDs.length!==80)throw new Error('Invalid key map');
  for(let k=0;k<80;k++){
    const c=device.color(positions[k][0],positions[k][1]);
    if(!c||c.length<3)throw new Error('SignalRGB color missing for '+names[k]);
    const j=4*k;f[j]=ledIDs[k];f[j+1]=clamp(c[0]);f[j+2]=clamp(c[1]);f[j+3]=clamp(c[2]);
  }
  // Six HID reports contain 84 indexed RGB records, but only 80 physical LEDs.
  // In v31/v32, zero padding created four [0,0,0,0] records, which may
  // unexpectedly blank LED 0 (Esc). The v33 seven-second physical test
  // found that replacing those records removed the visible flicker.
  // Preserve identical valid ID and color bytes for the last four LEDs.
  for(let extra=0;extra<4;extra++){
    const src=(76+extra)*4,dst=(80+extra)*4;
    for(let byte=0;byte<4;byte++)f[dst+byte]=f[src+byte];
  }
  return f;
}
function sameFrame(a,b){if(!a||!b)return false;
  for(let i=0;i<336;i++)if(a[i]!==b[i])return false;return true;}
function makePacket(f,block){
  const off=block*56;
  const p=[0,0xAA,0x32,0x38,off&255,(off>>8)&255,0,(block===5?1:0),0,...f.slice(off,off+56)];
  if(p.length!==65)throw new Error('HID packet length mismatch');
  for(let j=0;j<14;j++){
    const k=block*14+j,expected=ledIDs[k<80?k:(k-4)];
    if(p[9+j*4]!==expected)throw new Error('Key-map packet mismatch');
  }
  return p;
}
function sendVerified(p){
  device.write(p,65);
  const raw=device.read([0],65,75);
  const a=raw && typeof raw.length==='number'?Array.from(raw):[];
  const s=a[0]===0x55?0:(a[0]===0&&a[1]===0x55?1:-1);
  if(s<0||a.length<s+64)throw new Error('USB ACK absent/short');
  // Compare entire payload echo, as in v31. No retries or speculative writes.
  for(let j=1;j<64;j++)if(a[s+j]!==p[j+1])throw new Error('USB ACK mismatch @'+j);
  if(!firstAck){firstAck=true;log('First complete packet ACK echo verified');}
  packets++;healthPackets++;
}
function report(now,final){
  const elapsed=now-healthAt;
  if(elapsed<10000&&!final)return;
  if(elapsed>0)log('HEALTH: '+(healthFrames*1000/elapsed).toFixed(2)+
    ' complete frames/s; '+(healthPackets*1000/elapsed).toFixed(1)+
    ' ACKed packets/s; '+frames+' complete frames, '+packets+
    ' packets total; '+keepalives+' static keepalive frames; zero detected ACK errors (NOT evidence of typing safety).');
  healthAt=now;healthFrames=0;healthPackets=0;
}
export function Render(){
  if(shutdown){device.pause(100);return;}
  const mode=syncMode;
  if(mode!==previousMode){
    previousMode=mode;
    if(mode===OFF){
      phase=faulted?'stopped':'idle';lastFrame=null;
      log('OFF: USB writes disabled. OFF cannot restore onboard lighting; reconnect if needed.');
    }else if(faulted){phase='stopped';log('SAFETY LOCK: prior USB or sampling failure; restart plugin after checking keyboard');}
    else if(mode===LIVE){
      // Auto-arm on boot, or immediately upon LIVE selection after boot settles.
      // No OFF->LIVE workaround needed. Never auto-rearm following any failure.
      phase='waiting';resetCounts(Date.now());
      log('LIVE selected; waiting for startup settle before first packet.');
    }else{phase='idle';log('Unknown mode; no writes');}
  }
  if(phase==='waiting'&&mode===LIVE){
    const remaining=STARTUP_SETTLE_MS-(Date.now()-startupAt);
    if(remaining>0){device.pause(Math.min(100,Math.max(1,remaining)));return;}
    phase='running';resetCounts(Date.now());
    log('START: automatic LIVE sync active. Six v34 packets/frame, v36 750ms static keepalive, verified ACKs, fault lock.');
  }
  if(phase!=='running'||mode!==LIVE){device.pause(100);return;}
  try{
    const now=Date.now();
    if(lastFrameStart&&now-lastFrameStart<MIN_FRAME_START_MS){
      device.pause(Math.min(5,Math.max(1,MIN_FRAME_START_MS-(now-lastFrameStart))));return;
    }
    // device.color reads the live SignalRGB canvas. This supports arbitrary
    // effects including Rainbow, solid color, gradients, patterns, and waves.
    const f=samplePacked();
    // Unlike v35, do not deduplicate a static frame indefinitely: the keyboard's
    // firmware appears to fall back to hardware Rainbow after seconds of silence.
    // Keepalive is a full, *verified* six-packet frame; no new USB commands.
    const unchanged=sameFrame(f,lastFrame);
    if(unchanged && now-lastFrameStart<STATIC_KEEPALIVE_MS){
      report(now,false);device.pause(8);return;
    }
    const started=Date.now();lastFrameStart=started;
    for(let b=0;b<FRAME_PACKETS;b++){
      if(Date.now()-started>MAX_FRAME_WATCHDOG_MS)
        throw new Error('Per-frame watchdog exceeded');
      sendVerified(makePacket(f,b));
    }
    lastFrame=f;frames++;healthFrames++;
    if(unchanged){
      keepalives++;
      if(keepalives===1)log('First static keepalive frame verified; continuing every ~750ms while colors remain unchanged.');
    }
    if(frames===1)log('First complete six-packet frame ACKed in '+(Date.now()-started)+'ms.');
    report(Date.now(),false);
  }catch(e){report(Date.now(),true);stop('USB/sample/watchdog failure: '+String(e));}
  device.pause(1);
}
export function Shutdown(){shutdown=true;phase='stopped';lastFrame=null;}
