import IconMail from "@/assets/icons/IconMail.svg";
import IconBrandX from "@/assets/icons/IconBrandX.svg";
import IconWhatsapp from "@/assets/icons/IconWhatsapp.svg";
import IconFacebook from "@/assets/icons/IconFacebook.svg";
import IconTelegram from "@/assets/icons/IconTelegram.svg";
import IconPinterest from "@/assets/icons/IconPinterest.svg";
import { siGithub, siGmail, siX, siXiaohongshu } from "simple-icons";

interface SocialLink {
  name: string;
  href: string;
  linkTitle: string;
  path: string;
}

interface ShareLink {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: import("astro").Props) => Element;
}

export const SOCIALS: SocialLink[] = [
  {
    name: "Mail",
    href: "mailto:iwannabewater@gmail.com",
    linkTitle: "Email Winston",
    path: siGmail.path,
  },
  {
    name: "X",
    href: "https://x.com/lilmochimo01",
    linkTitle: "Winston on X",
    path: siX.path,
  },
  {
    name: "GitHub",
    href: "https://github.com/iwannabewater",
    linkTitle: "Winston on GitHub",
    path: siGithub.path,
  },
  {
    name: "Xiaohongshu",
    href: "https://www.xiaohongshu.com/user/profile/626cb58e000000001501d135",
    linkTitle: "Winston on Xiaohongshu",
    path: siXiaohongshu.path,
  },
] as const;

export const SHARE_LINKS: ShareLink[] = [
  {
    name: "WhatsApp",
    href: "https://wa.me/?text=",
    linkTitle: `Share this post via WhatsApp`,
    icon: IconWhatsapp,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/sharer.php?u=",
    linkTitle: `Share this post on Facebook`,
    icon: IconFacebook,
  },
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on X`,
    icon: IconBrandX,
  },
  {
    name: "Telegram",
    href: "https://t.me/share/url?url=",
    linkTitle: `Share this post via Telegram`,
    icon: IconTelegram,
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com/pin/create/button/?url=",
    linkTitle: `Share this post on Pinterest`,
    icon: IconPinterest,
  },
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: `Share this post via email`,
    icon: IconMail,
  },
] as const;
