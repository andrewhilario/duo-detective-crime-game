import React from 'react';
import { SuspectAvatar as AvatarData } from '../data/cases';

interface Props {
  avatar: AvatarData;
  size?: number;
  className?: string;
}

export const SuspectAvatar: React.FC<Props> = ({ avatar, size = 80, className = '' }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative shrink-0 overflow-hidden rounded-full ${className}`}
    >
      {/* Sepia / noir colour grade overlay */}
      <div className="absolute inset-0 z-10 rounded-full mix-blend-multiply pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)' }}
      />
      {/* Slight sepia tint */}
      <div className="absolute inset-0 z-10 rounded-full pointer-events-none opacity-20"
        style={{ background: '#7B5B3A' }}
      />
      <img
        src={avatar.photoUrl}
        alt="Suspect portrait"
        width={size}
        height={size}
        className="w-full h-full object-cover object-top rounded-full"
        style={{ filter: 'grayscale(30%) contrast(1.05)' }}
        loading="lazy"
        draggable={false}
      />
    </div>
  );
};
