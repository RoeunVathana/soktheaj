import logoProfile from '../assets/img/logoProfile.jpg';
import logoaVATORS from '../assets/img/avotors.png';

const profiles = [
  {
    id: 1,
    name: 'Sothea Chhum',
    title: 'Full Stack Developer',
    headline: {
      en: 'Building Modern Web Experiences',
      kh: 'កសាងបទពិសោធន៍វិបសាយទំនើបៗ',
    },
    description:
      'I craft modern, scalable web applications using React, Laravel, and Node.js. From concept to deployment, I build digital experiences that are fast, responsive, and user-friendly — tailored to solve real-world challenges.',
    bio: 'I am a passionate Full Stack Developer specializing in React.js, Laravel, Node.js, Express.js, MySQL, MongoDB, Tailwind CSS, Bootstrap, REST APIs, and modern web technologies. I love building modern, responsive, scalable, and user-friendly web applications that solve real-world problems with clean and efficient code. I am always learning new technologies and improving my skills to deliver high-quality digital solutions that make a difference.',
    avatar: logoProfile,
    avatars: [
      logoaVATORS,
      logoaVATORS,
      logoaVATORS,
    ],
    initials: 'SC',
    tagline: {
      en: 'Turning ideas into elegant, scalable digital solutions.',
      kh: 'បំលែងគំនិតទៅជាដំណោះស្រាយឌីជីថលដ៏ប្រណិត និងអាចពង្រីកបាន',
    },
    hireMeDescription:
      "I'm Sothea Chhum, a Full Stack Developer passionate about building modern web applications that solve real problems. With expertise in React.js, Laravel, Node.js, Express.js, MySQL, MongoDB, Tailwind CSS, Bootstrap, and REST APIs, I bring ideas to life with clean, efficient code. I specialize in creating responsive, scalable, and user-friendly digital solutions — from landing pages to complex web platforms. I'm constantly learning and staying up to date with the latest technologies to deliver the best results. If you're looking for a dedicated developer who takes pride in writing quality code and delivering on time, let's work together to build something exceptional.",
    typewriterStrings: [
      'Full Stack Developer',
      'React.js Specialist',
      'Laravel & Node.js Developer',
      'UI/UX Enthusiast',
      'Problem Solver',
    ],
    socials: [
      { icon: 'FiGithub', href: 'https://github.com/jigarsable', label: 'GitHub' },
      { icon: 'FiLinkedin', href: 'https://liner.com/jigarsable', label: 'Twitter' },
      { icon: 'FaTelegramPlane', href: 'https://t.me/jigarsable', label: 'Telegram' },
      { icon: 'FiInstagram', href: 'https://inkedin.com/in/jigarsable', label: 'LinkedIn' },
      { icon: 'FiTwitter', href: 'https://twittstagram.com/jigarsable', label: 'Instagram' },
      { icon: 'FaDev', href: 'https://dev.to/jigarsable', label: 'Dev.to' },
    ],
    contact: {
      email: 'sothea@example.com',
      telegram: 'https://t.me/sothea',
      telegramUsername: 'sothea',
    },
    faqs: [
      {
        question: 'What services do I offer as a Freelancer?',
        answer:
          'I offer a wide range of services including web development (Frontend & Backend), UI/UX design, API integration, database design, and IT consulting. My expertise spans modern technologies like Laravel, React, Node.js, and Tailwind CSS to deliver high-quality digital solutions.',
      },
      {
        question: 'How long does it typically take to complete a project?',
        answer:
          'Project timelines vary depending on scope and complexity. A simple website typically takes 2-4 weeks, while more complex web applications can take 2-3 months. I always provide a realistic timeline estimate during our initial consultation and keep clients updated throughout the development process.',
      },
      {
        question: 'What technologies and tools do I use?',
        answer:
          'I work with a modern tech stack including React, Laravel, Node.js, Express.js, MySQL, MongoDB, Tailwind CSS, Bootstrap, and REST APIs. For design, I use Figma. I also have experience with cloud services and modern deployment platforms.',
      },
      {
        question: 'Do I provide post-launch support and maintenance?',
        answer:
          'Yes, I offer comprehensive post-launch support and maintenance packages. This includes bug fixes, security updates, performance optimization, content updates, and technical support. I believe in building long-term relationships with my clients to ensure their digital products continue to perform optimally.',
      },
      {
        question: 'How can I get started working with me?',
        answer:
          'Getting started is easy! Simply reach out through the contact form, email, or directly on Telegram. We will schedule a free consultation to discuss your project requirements, goals, and budget. After that, I will provide a detailed proposal and timeline. Once agreed, we will begin the development process with regular updates and communication.',
      },
    ],
  },
];

export default profiles;