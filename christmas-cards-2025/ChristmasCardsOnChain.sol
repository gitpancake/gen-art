// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title Christmas Cards 2025 - Fully On-Chain
 * @notice Generative winter scenes stored entirely on-chain
 * @dev All art is generated from seed, no external dependencies
 */
contract ChristmasCardsOnChain is ERC721, Ownable {
    using Strings for uint256;
    
    uint256 public constant MAX_SUPPLY = 100;
    uint256 public totalSupply = 0;
    uint256 public mintPrice = 0.005 ether;
    bool public mintingEnabled = true;
    
    // Store the minified generative code on-chain
    string private constant PART1 = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{margin:0;padding:0;box-sizing:border-box}body{overflow:hidden;background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh}#c{display:block;max-width:100%;max-height:100vh}</style></head><body><canvas id="c"></canvas><script>';
    
    string private constant PART2 = 'class R{constructor(s){this.s=this.h(s);this.o=this.s}h(t){let h=0;for(let i=0;i<t.length;i++){h=((h<<5)-h)+t.charCodeAt(i);h=h&h}return Math.abs(h)}n(){this.s=(this.s*1664525+1013904223)%2147483647;return this.s/2147483647}}';
    
    string private constant PART3 = 'let seed="TOKEN_ID";const r=new R(seed);const fx=()=>r.n();const cv=document.getElementById("c");const ct=cv.getContext("2d");const S=Math.min(innerWidth,innerHeight);cv.width=S;cv.height=S;';
    
    string private constant PART4 = 'const AR=Math.floor(S/20);const sa=new Array(AR).fill(0);const MH=S*0.7;const RT=1;let mx=-1e3,my=-1e3,px=-1e3,py=-1e3,vx=0,vy=0;const MR=S*0.1,PF=15;';
    
    string private constant PART5 = 'const st=[];for(let i=0;i<50;i++)st.push({x:fx()*S,y:fx()*S*0.4,s:fx()*2+0.5,b:fx(),ts:0.01+fx()*0.02,p:fx()*Math.PI*2});let td=0;';
    
    string private constant PART6 = 'const pl=[{b1:"#0a1929",b2:"#1e3a5f"},{b1:"#001219",b2:"#005f73"},{b1:"#2c003e",b2:"#512b58"},{b1:"#1a1a2e",b2:"#3d5a80"},{b1:"#0d1b2a",b2:"#2c5f88"}];const p=pl[Math.floor(fx()*5)];';
    
    string private constant PART7 = 'const ir=fx(),sr=fx(),wr=fx();const f={si:ir>0.7?"B":ir>0.4?"H":"L",ss:sr>0.5?"L":"S",w:wr>0.7?"S":wr>0.3?"M":"C"};';
    
    string private constant PART8 = 'function bg(){const d=(Math.sin(td)+1)/2;const a=(c,f)=>{const h=c.replace("#","");const r=parseInt(h.substr(0,2),16);const g=parseInt(h.substr(2,2),16);const b=parseInt(h.substr(4,2),16);return`rgb(${r+(255-r)*f*0.3},${g+(255-g)*f*0.3},${b+(255-b)*f*0.4})`};const g=ct.createLinearGradient(0,0,0,S);g.addColorStop(0,a(p.b1,d));g.addColorStop(1,a(p.b2,d));ct.fillStyle=g;ct.fillRect(0,0,S,S)}';
    
    string private constant PART9 = 'function ds(){st.forEach(t=>{t.p+=t.ts;const b=(Math.sin(t.p)+1)/2*t.b;ct.save();ct.fillStyle=`rgba(255,255,255,${b})`;ct.shadowBlur=t.s*4;ct.shadowColor=`rgba(255,255,255,${b})`;ct.beginPath();for(let i=0;i<4;i++){const a=(i/4)*Math.PI*2;const x=t.x+Math.cos(a)*t.s;const y=t.y+Math.sin(a)*t.s;i===0?ct.moveTo(x,y):ct.lineTo(x,y)}ct.closePath();ct.fill();ct.restore()})}';
    
    string private constant PART10 = 'class Sn{constructor(d=1){this.d=d;this.r();this.y=fx()*S;this.o=(0.3+fx()*0.7)*(0.5+d*0.25);this.sw=0;this.ss=(0.01+fx()*0.02)*(1+d*0.3)}r(){this.x=fx()*S;this.y=-20;const sm=f.ss==="L"?1.5:1;const ds=0.3+this.d*0.35;this.s=(fx()*4+1)*sm*ds;this.sp=((3-this.s*0.3)+fx()*0.5)*(0.5+this.d*0.25);const ws=f.w==="S"?1.5:f.w==="M"?0.8:0.3;this.w=(fx()*ws-ws/2)*(0.5+this.d*0.25)}';
    
    string private constant PART11 = 'u(){if(this.d>=1){const dx=this.x-mx,dy=this.y-my,dt=Math.sqrt(dx*dx+dy*dy);if(dt<MR&&dt>0){const fc=(1-dt/MR)*PF*(this.d/2);this.x+=(dx/dt)*fc+vx*0.5;this.y+=(dy/dt)*fc*0.3+Math.abs(vy)*0.2}}this.y+=this.sp;this.sw+=this.ss;this.x+=this.w+Math.sin(this.sw)*0.5;const gi=Math.max(0,Math.min(AR-1,Math.floor(this.x/(S/AR))));const sh=sa[gi];if(this.y>=S-sh-this.s){if(this.d===2&&sh<MH){sa[gi]+=RT*this.s;if(gi>0)sa[gi-1]+=RT*this.s*0.3;if(gi<AR-1)sa[gi+1]+=RT*this.s*0.3}this.r()}if(this.x>S+10)this.x=-10;if(this.x<-10)this.x=S+10}';
    
    string private constant PART12 = 'dr(){ct.fillStyle=`rgba(255,255,255,${this.o})`;ct.beginPath();ct.arc(this.x,this.y,this.s,0,Math.PI*2);ct.fill()}}';
    
    string private constant PART13 = 'const im={B:120,H:70,L:30};const si=im[f.si];const sf=[...Array(Math.floor(si*0.2)).fill(0).map(()=>new Sn(0)),...Array(Math.floor(si*0.3)).fill(0).map(()=>new Sn(1)),...Array(si).fill(0).map(()=>new Sn(2))];';
    
    string private constant PART14 = 'function da(){if(Math.max(...sa)<1)return;ct.fillStyle="rgba(255,255,255,0.95)";ct.strokeStyle="rgba(200,220,255,0.3)";ct.lineWidth=2;ct.beginPath();ct.moveTo(0,S);for(let i=0;i<AR;i++){const x=(i/AR)*S;const h=sa[i];ct.quadraticCurveTo(x,S-h,x+(S/AR)*0.5,S-h)}ct.lineTo(S,S);ct.lineTo(0,S);ct.closePath();ct.fill();ct.stroke()}';
    
    string private constant PART15 = 'function an(){td+=0.0001;vx=mx-px;vy=my-py;px=mx;py=my;bg();ds();sf.filter(s=>s.d===0).forEach(s=>{s.u();s.dr()});sf.filter(s=>s.d===1).forEach(s=>{s.u();s.dr()});da();for(let i=1;i<AR-1;i++)sa[i]+=(sa[i-1]+sa[i+1])/2-sa[i]*0.01;sf.filter(s=>s.d===2).forEach(s=>{s.u();s.dr()});requestAnimationFrame(an)}';
    
    string private constant PART16 = 'cv.addEventListener("mousemove",e=>{const r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});cv.addEventListener("mouseleave",()=>{mx=my=-1e3});an()';
    
    string private constant PART17 = '</script></body></html>';
    
    mapping(uint256 => uint256) public tokenSeeds;
    
    constructor() ERC721("Christmas Cards 2025", "XMAS25") {}
    
    function mint() public payable {
        require(mintingEnabled, "Minting disabled");
        require(totalSupply < MAX_SUPPLY, "Sold out");
        require(msg.value >= mintPrice, "Insufficient payment");
        
        uint256 tokenId = totalSupply;
        totalSupply++;
        
        // Generate unique seed for this token
        tokenSeeds[tokenId] = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            tokenId
        )));
        
        _safeMint(msg.sender, tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        // Get traits from seed
        string memory traits = generateTraits(tokenSeeds[tokenId]);
        
        // Build the complete HTML with the token's seed
        string memory html = string(abi.encodePacked(
            PART1, PART2, PART3,
            'let seed="', tokenId.toString(), '";',
            PART4, PART5, PART6, PART7, PART8, PART9,
            PART10, PART11, PART12, PART13, PART14,
            PART15, PART16, PART17
        ));
        
        // Encode as data URI
        string memory dataURI = string(abi.encodePacked(
            "data:text/html;base64,",
            Base64.encode(bytes(html))
        ));
        
        // Build metadata JSON
        string memory json = string(abi.encodePacked(
            '{"name":"Christmas Card #', tokenId.toString(),
            '","description":"Fully on-chain generative winter scene",',
            '"animation_url":"', dataURI, '",',
            traits,
            '}'
        ));
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        ));
    }
    
    function generateTraits(uint256 seed) internal pure returns (string memory) {
        // Simple trait generation from seed
        uint256 rand1 = seed % 100;
        uint256 rand2 = (seed / 100) % 100;
        uint256 rand3 = (seed / 10000) % 100;
        
        string memory intensity = rand1 > 70 ? "Blizzard" : rand1 > 40 ? "Heavy" : "Light";
        string memory size = rand2 > 50 ? "Large Flakes" : "Small Flakes";
        string memory wind = rand3 > 70 ? "Strong" : rand3 > 30 ? "Moderate" : "Calm";
        
        return string(abi.encodePacked(
            '"attributes":[',
            '{"trait_type":"Snow Intensity","value":"', intensity, '"},',
            '{"trait_type":"Snow Size","value":"', size, '"},',
            '{"trait_type":"Wind","value":"', wind, '"}',
            ']'
        ));
    }
    
    function setMintPrice(uint256 _price) public onlyOwner {
        mintPrice = _price;
    }
    
    function toggleMinting() public onlyOwner {
        mintingEnabled = !mintingEnabled;
    }
    
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}