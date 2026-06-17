import { Icons } from "@/components/common/icons";

interface SocialInterface {
  name: string;
  username: string;
  icon: any;
  link: string;
}

export const SocialLinks: SocialInterface[] = [
  {
    name: "Github",
    username: "@javeedishaq",
    icon: Icons.gitHub,
    link: "https://github.com/javeedishaq",
  },
  {
    name: "LinkedIn",
    username: "Javeed Ishaq",
    icon: Icons.linkedin,
    link: "https://www.linkedin.com/in/javeedishaq",
  },
  {
    name: "Twitter",
    username: "@javeedishaq",
    icon: Icons.twitter,
    link: "https://x.com/javeedishaq",
  },
  {
    name: "Gmail",
    username: "javeedishaq",
    icon: Icons.gmail,
    link: "mailto:javeedishaq@gmail.com",
  },
];
