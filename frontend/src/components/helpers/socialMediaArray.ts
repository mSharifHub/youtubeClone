import facebookIcon from '../../assets/social_media_icons/facebookIcon.png';
import linkedinIcon from '../../assets/social_media_icons/linkedinIcon.png';
import xIcon from '../../assets/social_media_icons/xIcon.png';

type SocialMedia = {
  name: string;
  icon: string;
};

export const socialMediaArray: SocialMedia[] = [
  {
    name: 'facebook',
    icon: facebookIcon,
  },
  {
    name: 'linkedin',
    icon: linkedinIcon,
  },
  {
    name: 'x',
    icon: xIcon,
  },

];
