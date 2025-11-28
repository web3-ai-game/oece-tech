"use client";

import { 
  SiTelegram, SiInstagram, SiYoutube, SiTiktok, SiFacebook, 
  SiX, SiLinkedin, SiDiscord, SiSlack, SiNotion, SiWhatsapp, SiWechat,
  SiGoogle, SiApple, SiGithub
} from "react-icons/si";
import { BsMicrosoft } from "react-icons/bs";
import { MdEmail, MdPhone, MdPersonOff } from "react-icons/md";
import { VscKey } from "react-icons/vsc";

const socialChannels = [
  { name: "Telegram", icon: SiTelegram, color: "#26A5E4" },
  { name: "Instagram", icon: SiInstagram, color: "#E4405F" },
  { name: "YouTube", icon: SiYoutube, color: "#FF0000" },
  { name: "TikTok", icon: SiTiktok, color: "#FFFFFF" },
  { name: "Facebook", icon: SiFacebook, color: "#1877F2" },
  { name: "X", icon: SiX, color: "#FFFFFF" },
  { name: "LinkedIn", icon: SiLinkedin, color: "#0A66C2" },
  { name: "Discord", icon: SiDiscord, color: "#5865F2" },
  { name: "Slack", icon: SiSlack, color: "#4A154B" },
  { name: "Notion", icon: SiNotion, color: "#FFFFFF" },
  { name: "WhatsApp", icon: SiWhatsapp, color: "#25D366" },
  { name: "WeChat", icon: SiWechat, color: "#07C160" },
];

const authProviders = [
  { name: "Email", icon: MdEmail, color: "#22C55E", type: "native" },
  { name: "Phone", icon: MdPhone, color: "#22C55E", type: "native" },
  { name: "Anonymous", icon: MdPersonOff, color: "#22C55E", type: "native" },
  { name: "Google", icon: SiGoogle, color: "#4285F4", type: "oauth" },
  { name: "Facebook", icon: SiFacebook, color: "#1877F2", type: "oauth" },
  { name: "Apple", icon: SiApple, color: "#FFFFFF", type: "oauth" },
  { name: "GitHub", icon: SiGithub, color: "#FFFFFF", type: "oauth" },
  { name: "Microsoft", icon: BsMicrosoft, color: "#00A4EF", type: "oauth" },
  { name: "X", icon: SiX, color: "#FFFFFF", type: "oauth" },
  { name: "OpenID", icon: VscKey, color: "#A855F7", type: "sso" },
  { name: "SAML", icon: VscKey, color: "#A855F7", type: "sso" },
];

export function SocialChannels() {
  return (
    <div className="py-6 text-center">
      <span className="text-[10px] font-mono text-gray-500 uppercase">📢 Omni-Channel Marketing</span>
      <div className="flex flex-wrap justify-center gap-5 mt-3">
        {socialChannels.map((item) => (
          <item.icon key={item.name} className="w-6 h-6 hover:scale-125 transition-transform cursor-pointer" style={{ color: item.color }} title={item.name} />
        ))}
      </div>
    </div>
  );
}

export function AuthProviders() {
  return (
    <div className="py-6 text-center">
      <span className="text-[10px] font-mono text-orange-400 uppercase">🔐 全棧登錄支持</span>
      <div className="flex flex-wrap justify-center gap-5 mt-3">
        {authProviders.map((item) => (
          <item.icon key={item.name} className="w-5 h-5 hover:scale-125 transition-transform cursor-pointer" style={{ color: item.color }} title={item.name} />
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-2 text-[9px] text-gray-600">
        <span><span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1" />Native</span>
        <span><span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mr-1" />OAuth</span>
        <span><span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mr-1" />SSO</span>
      </div>
    </div>
  );
}
