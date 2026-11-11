import React from 'react';
import { getImageUrl } from '../utils/helpers';
import {
  SiPhpstorm,
  SiPostman,
  SiFigma,
  SiGit,
  SiDocker,
  SiNotion,
  SiMysql,
  SiPostgresql
} from 'react-icons/si';

/**
 * Maps database icon strings to React Icon components.
 * Each entry is a function receiving a className for sizing so the icon
 * can be rendered at multiple sizes (e.g. large cards or small badges).
 */
const softwareIconMap = {
  // VS Code (upload from Backend as img)
  'vscode-icon': (sizeCls) => <img src={getImageUrl('icons/vscode.svg')} alt="VS Code" className={`${sizeCls} object-contain`} />,
  vscode: (sizeCls) => <img src={getImageUrl('icons/vscode.svg')} alt="VS Code" className={`${sizeCls} object-contain`} />,
  'visual-studio-code': (sizeCls) => <img src={getImageUrl('icons/vscode.svg')} alt="VS Code" className={`${sizeCls} object-contain`} />,
  // PhpStorm
  'phpstorm-icon': (sizeCls) => <SiPhpstorm className={`${sizeCls} text-[#000000] dark:text-white`} />,
  phpstorm: (sizeCls) => <SiPhpstorm className={`${sizeCls} text-[#000000] dark:text-white`} />,
  // Postman
  'postman-icon': (sizeCls) => <SiPostman className={`${sizeCls} text-[#FF6C37]`} />,
  postman: (sizeCls) => <SiPostman className={`${sizeCls} text-[#FF6C37]`} />,
  // Figma
  'figma-icon': (sizeCls) => <SiFigma className={`${sizeCls} text-[#F24E1E]`} />,
  figma: (sizeCls) => <SiFigma className={`${sizeCls} text-[#F24E1E]`} />,
  // Git
  'git-icon': (sizeCls) => <SiGit className={`${sizeCls} text-[#F05032]`} />,
  git: (sizeCls) => <SiGit className={`${sizeCls} text-[#F05032]`} />,
  // Docker
  'docker-icon': (sizeCls) => <SiDocker className={`${sizeCls} text-[#2496ED]`} />,
  docker: (sizeCls) => <SiDocker className={`${sizeCls} text-[#2496ED]`} />,
  // TablePlus (using SiPostgresql as fallback)
  'tableplus-icon': (sizeCls) => <SiPostgresql className={`${sizeCls} text-[#336791]`} />,
  tableplus: (sizeCls) => <SiPostgresql className={`${sizeCls} text-[#336791]`} />,
  // Notion
  'notion-icon': (sizeCls) => <SiNotion className={`${sizeCls} text-[#000000] dark:text-white`} />,
  notion: (sizeCls) => <SiNotion className={`${sizeCls} text-[#000000] dark:text-white`} />,
  // Slack (upload from Backend as img)
  'slack-icon': (sizeCls) => <img src={getImageUrl('icons/slack.svg')} alt="Slack" className={`${sizeCls} object-contain`} />,
  slack: (sizeCls) => <img src={getImageUrl('icons/slack.svg')} alt="Slack" className={`${sizeCls} object-contain`} />,
  // Photoshop (upload from Backend as img)
  'photoshop-icon': (sizeCls) => <img src={getImageUrl('icons/photoshop.svg')} alt="Photoshop" className={`${sizeCls} object-contain`} />,
  photoshop: (sizeCls) => <img src={getImageUrl('icons/photoshop.svg')} alt="Photoshop" className={`${sizeCls} object-contain`} />,
  // SourceTree (using SiGit as fallback)
  'sourcetree-icon': (sizeCls) => <SiGit className={`${sizeCls} text-[#0052CC]`} />,
  sourcetree: (sizeCls) => <SiGit className={`${sizeCls} text-[#0052CC]`} />,
  // HeidiSQL / MySQL
  'heidisql-icon': (sizeCls) => <SiMysql className={`${sizeCls} text-[#4479A1]`} />,
  heidisql: (sizeCls) => <SiMysql className={`${sizeCls} text-[#4479A1]`} />,
  mysql: (sizeCls) => <SiMysql className={`${sizeCls} text-[#4479A1]`} />,
  // PostgreSQL
  postgresql: (sizeCls) => <SiPostgresql className={`${sizeCls} text-[#336791]`} />,
  // MariaDB
  mariadb: (sizeCls) => <SiMysql className={`${sizeCls} text-[#4479A1]`} />,
};

/**
 * SoftwareApps - A component that renders a software application icon.
 * - If the icon string matches a key in softwareIconMap, renders the React Icon.
 * - If the icon string is a URL or file path, renders an <img> tag.
 * - Otherwise, shows a fallback letter initial.
 *
 * @param {object} app - The software application object from the API
 * @param {string} className - Tailwind size classes for the icon (default: w-10 h-10)
 */
const SoftwareApps = ({ app, className = 'w-10 h-10' }) => {
  const iconStr = app?.icon;
  // Backend returns the localized name directly (based on Accept-Language header)
  const name = app?.name || '';

  // Small renderings (badges) use a smaller fallback font
  const isSmall = className.includes('w-3') || className.includes('w-4');

  // Helper to render fallback letter
  const renderFallback = () => (
    <span className={`text-purple-700 dark:text-purple-300 font-bold ${isSmall ? 'text-[8px]' : 'text-sm'}`}>
      {name.charAt(0).toUpperCase() || '?'}
    </span>
  );

  // If no icon, show fallback letter
  if (!iconStr) {
    return renderFallback();
  }

  // Check if icon is a React Icon key (no URL paths, no file paths)
  const isReactIconKey = !iconStr.startsWith('http') && !iconStr.startsWith('https') && !iconStr.includes('/');

  if (isReactIconKey) {
    const matchedIcon = softwareIconMap[iconStr.toLowerCase()];
    if (matchedIcon) {
      return matchedIcon(className);
    }
  }

  // Check if icon is an image URL or file path
  if (iconStr.startsWith('http') || iconStr.startsWith('https') || iconStr.includes('/')) {
    return (
      <img
        src={iconStr.startsWith('http') ? iconStr : getImageUrl(iconStr)}
        alt={name || 'icon'}
        className={`${className} object-contain`}
        onError={(e) => {
          e.target.style.display = 'none';
          const parent = e.target.parentElement;
          if (parent) {
            const fallback = document.createElement('span');
            fallback.className = `text-purple-700 dark:text-purple-300 font-bold ${isSmall ? 'text-[8px]' : 'text-sm'}`;
            fallback.textContent = name.charAt(0).toUpperCase() || '?';
            parent.appendChild(fallback);
          }
        }}
      />
    );
  }

  // Fallback: show letter initial
  return renderFallback();
};

export default SoftwareApps;