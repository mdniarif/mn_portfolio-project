import { builderRoles } from './content';

type Agent = { x:number; y:number; tx:number; ty:number; vx:number; vy:number; size:number; color:string; phase:number; role?:string; named:boolean; alpha:number; orbit:number; speed:number };
const COLORS = ['#3478F6','#8758FF','#FF5A70','#13B89A','#FF963B','#E84CB8','#28BCE8','#A5C940','#6741D9','#F26B38'];
const rand = (n:number) => { let t = n + 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
export class CursorEngine {
  private back: HTMLCanvasElement; private front: HTMLCanvasElement; private b: CanvasRenderingContext2D; private f: CanvasRenderingContext2D;
  private agents: Agent[]=[]; private w=0; private h=0; private dpr=1; private raf=0; private last=0; private progress=0; private mouse={x:-1000,y:-1000}; private click:{x:number;y:number;t:number}|null=null; private points:{x:number;y:number}[]=[]; private reduced=false; private hovered='';
  constructor(back:HTMLCanvasElement, front:HTMLCanvasElement){ this.back=back; this.front=front; this.b=back.getContext('2d')!; this.f=front.getContext('2d')!; this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches; this.resize(); this.seed(); window.addEventListener('resize',this.resize); window.addEventListener('pointermove',this.onMove,{passive:true}); window.addEventListener('pointerdown',this.onClick,{passive:true}); if(!this.reduced) this.loop(0); else this.draw(0); }
  private resize=()=>{ this.w=innerWidth; this.h=innerHeight; this.dpr=Math.min(devicePixelRatio||1,2); for(const c of [this.back,this.front]){c.width=Math.round(this.w*this.dpr);c.height=Math.round(this.h*this.dpr);c.style.width=this.w+'px';c.style.height=this.h+'px';} this.b.setTransform(this.dpr,0,0,this.dpr,0,0); this.f.setTransform(this.dpr,0,0,this.dpr,0,0); this.seed(); };
  private seed(){ const count=this.reduced?12:this.w>=1500?300:this.w>=1100?250:this.w>=760?190:140; this.agents=Array.from({length:count},(_,i)=>{const x=rand(i+2)*this.w,y=rand(i+50)*this.h;return{x,y,tx:x,ty:y,vx:0,vy:0,size:i<12?13:7+rand(i+88)*4,color:COLORS[i%COLORS.length],phase:rand(i+100)*Math.PI*2,role:i<12?builderRoles[i]:undefined,named:i<12,alpha:i<14?1:0,orbit:30+rand(i+222)*140,speed:.15+rand(i+400)*.35};}); }
  private onMove=(e:PointerEvent)=>{this.mouse.x=e.clientX;this.mouse.y=e.clientY;}; private onClick=(e:PointerEvent)=>{this.click={x:e.clientX,y:e.clientY,t:performance.now()};};
  setProgress(p:number){this.progress=p;}
  setTargetPoints(points:{x:number;y:number}[]){this.points=points;}
  setHovered(label:string){this.hovered=label;}
  private loop=(t:number)=>{const dt=Math.min(40,t-this.last||16);this.last=t;this.draw(t);this.raf=requestAnimationFrame(this.loop);};
  private draw(t:number){const {w,h,b,f}=this;b.clearRect(0,0,w,h);f.clearRect(0,0,w,h);const p=this.progress;const nameMode=p>.17&&p<.64;const arrival=Math.min(1,Math.max(0,p/.18));
    const contact=document.querySelector('#contact'); const contactRect=contact?.getBoundingClientRect();
    const copyButton=document.querySelector('.email-copy button') as HTMLElement|null;
    const hoveredCard=this.hovered?(document.querySelector('.work-card:hover') as HTMLElement|null):null;
    const hoveredRect=hoveredCard?.getBoundingClientRect();
    this.agents.forEach((a,i)=>{const named=a.named; const edgeX=(i%2? -30:w+30),edgeY=rand(i+901)*h; let tx,ty;
      if(nameMode && this.points.length){const idx=(i*37)%this.points.length;const pt=this.points[idx];tx=pt.x;ty=pt.y;} else if(p>=.64 && p<.96 && named){const el=document.querySelector(`[data-builder="${i}"]`) as HTMLElement|null; if(el){const r=el.getBoundingClientRect();tx=r.left+r.width/2;ty=r.top+r.height/2;}else{tx=w/2+Math.cos(a.phase)*a.orbit;ty=h/2+Math.sin(a.phase)*a.orbit;}} else {const drift=Math.sin(t*.0003*a.speed+a.phase);tx=(i<14? w/2+Math.cos(a.phase+t*.0003)*a.orbit : edgeX*(1-arrival)+(w/2+Math.sin(a.phase+t*.0002)*a.orbit)*arrival);ty=(i<14?h/2+Math.sin(a.phase+t*.0003)*a.orbit:edgeY*(1-arrival)+(h/2+Math.cos(a.phase+t*.0002)*a.orbit)*arrival);}
      if(p>.5&&p<.66){tx+= (tx-w/2)*2;ty+=(ty-h/2)*1.6;}
      if(contactRect && contactRect.top < h*.78 && contactRect.bottom > h*.18 && copyButton && i<54){const cr=copyButton.getBoundingClientRect();const angle=(i/54)*Math.PI*2+t*.00025;const radius=48+(i%3)*7;tx=cr.left+cr.width/2+Math.cos(angle)*radius;ty=cr.top+cr.height/2+Math.sin(angle)*radius;}
      if(hoveredRect && i>=12 && i<24){const r=hoveredRect;const a=((i-12)/12)*Math.PI*2+t*.0005;tx=r.left+r.width/2+Math.cos(a)*(Math.max(r.width,r.height)*.48);ty=r.top+r.height/2+Math.sin(a)*(Math.max(r.width,r.height)*.48);}
      if(this.mouse.x>-100 && !nameMode && !named){const dx=tx-this.mouse.x,dy=ty-this.mouse.y,d=Math.hypot(dx,dy);if(d<90){tx+=dx/(d||1)*(90-d)*.7;ty+=dy/(d||1)*(90-d)*.7;}}
      a.tx=tx;a.ty=ty;const ease=nameMode ? .18 : .035;a.x+=(tx-a.x)*ease;a.y+=(ty-a.y)*ease;a.vx=(a.x-tx);a.vy=(a.y-ty);const fade=(p>.5&&p<.66)?Math.max(0,1-(p-.5)/.16):(p>.66&&!named ? .22 : 1); a.alpha=(named?1:(i<14?1:Math.max(0,arrival)))*fade;
      if(a.alpha<=.01)return;const ctx=named?f:b;const clickAge=this.click?(performance.now()-this.click.t):999;const nearClick=this.click&&Math.hypot(a.x-this.click.x,a.y-this.click.y)<58&&clickAge<170;this.drawArrow(ctx,a.x,a.y,a.size*(nearClick ? .72 : 1),a.color,a.alpha,Math.atan2(a.vy,a.vx)); if(named&&a.role&&p>.08&&p<.99)this.drawTag(ctx,a.x+10,a.y-10,a.role,a.color,a.alpha);
    });
    if(this.click){const age=(performance.now()-this.click.t)/650;if(age<1){f.beginPath();f.arc(this.click.x,this.click.y,age*48,0,Math.PI*2);f.strokeStyle=`rgba(52,120,246,${1-age})`;f.lineWidth=2;f.stroke();}else this.click=null;}
  }
  private drawArrow(ctx:CanvasRenderingContext2D,x:number,y:number,s:number,color:string,alpha:number,angle:number){ctx.save();ctx.translate(x,y);ctx.rotate(angle*.06);ctx.globalAlpha=alpha;ctx.shadowColor='rgba(20,20,20,.22)';ctx.shadowBlur=5;ctx.shadowOffsetY=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,s*1.55);ctx.lineTo(s*.38,s*1.12);ctx.lineTo(s*.72,s*1.9);ctx.lineTo(s*1.05,s*1.72);ctx.lineTo(s*.68,s*.95);ctx.lineTo(s*1.18,s*.9);ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.shadowColor='transparent';ctx.lineWidth=2.3;ctx.strokeStyle='#fff';ctx.stroke();ctx.restore();}
  private drawTag(ctx:CanvasRenderingContext2D,x:number,y:number,label:string,color:string,alpha:number){ctx.save();ctx.globalAlpha=alpha;ctx.font='600 9px Geist, sans-serif';const width=ctx.measureText(label).width+14;ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y-10,width,18,7);ctx.fill();ctx.fillStyle='#fff';ctx.fillText(label,x+7,y+2);ctx.restore();}
  destroy(){cancelAnimationFrame(this.raf);window.removeEventListener('resize',this.resize);window.removeEventListener('pointermove',this.onMove);window.removeEventListener('pointerdown',this.onClick);}
}
