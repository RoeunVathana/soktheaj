import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import ParticleNetwork from './components/ParticleNetwork';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import ProjectDetail from './pages/ProjectDetail';
import AllProjects from './pages/AllProjects';
import ExperienceEducation from './components/ExperienceEducation';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Partners from './components/Partners';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import SecurityModal from './components/SecurityModal';
import ProfileEditModal from './components/ProfileEditModal';
import RegisterPage from './pages/RegisterPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminExperiences from './pages/admin/AdminExperiences';
import AdminPartners from './pages/admin/AdminPartners';
import AdminSkills from './pages/admin/AdminSkills';
import AdminSoftwareApps from './pages/admin/AdminSoftwareApps';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSocials from './pages/admin/AdminSocials';
import AdminUsers from './pages/admin/AdminUsers';
import AdminEducation from './pages/admin/AdminEducation';
import AdminAchievements from './pages/admin/AdminAchievements';
import ProtectedRoute from './components/ProtectedRoute';
import Seo from './components/Seo';

const SITE_URL = 'https://soktheajr.com';

const HomePage = ({ onOpenAuth, onOpenSecurity, onOpenProfile }) => (
  <>
    <Seo
      title="Full Stack Developer"
      description="Portfolio of Sothea Chhum — a passionate Full Stack Developer specializing in React.js, Laravel, Node.js, Express.js, MySQL, MongoDB, Tailwind CSS, Bootstrap, and REST APIs. Building modern, responsive, and scalable web applications."
      keywords="Sothea Chhum,portfolio, Full Stack Developer, React.js, Laravel, Node.js, Express.js, MySQL, MongoDB, Tailwind CSS, Bootstrap, REST API, Web Developer, Portfolio, Cambodia, Web Development"
      canonicalUrl={SITE_URL}
    />
    <Navbar onOpenAuth={onOpenAuth} onOpenSecurity={onOpenSecurity} onOpenProfile={onOpenProfile} />
    <Hero />
    <About />
    <Skills />
    <Projects onOpenAuth={onOpenAuth} />
    <ExperienceEducation />
    <Achievements />
    <Contact />
    <Partners />
    <Footer />
  </>
);

const App = () => {
  const { theme } = useTheme();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleOpenAuth = (tab) => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setAuthModalOpen(false);
  };

  const handleOpenSecurity = () => {
    setSecurityModalOpen(true);
  };

  const handleCloseSecurity = () => {
    setSecurityModalOpen(false);
  };

  const handleOpenProfile = () => {
    setProfileModalOpen(true);
  };

  const handleCloseProfile = () => {
    setProfileModalOpen(false);
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sothea Chhum',
    url: SITE_URL,
    image: `${SITE_URL}/site-logo.png`,
    jobTitle: 'Full Stack Developer',
    description:
      'Passionate Full Stack Developer specializing in React.js, Laravel, Node.js, Express.js, MySQL, MongoDB, Tailwind CSS, Bootstrap, and REST APIs.',
    sameAs: [
      'https://www.youtube.com/@Sokthea.ProgrammingIT',
      'https://www.tiktok.com/@soktheaprogrammer?_r=1',
      'https://www.facebook.com/share/1Guk8c1LN1/?mibextid=wwXIfr',
      'https://t.me/sotheajr',
      'https://www.linkedin.com/in/sothea-chhum-1938023a8?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
      'https://www.instagram.com/sotheajr20?igsh=bGlzM29teXZncTFv&utm_source=qr',
      'https://t.me/rtfxr'
    
    ],
    knowsAbout: [
      'React.js',
      'Laravel',
      'Node.js',
      'Express.js',
      'MySQL',
      'MongoDB',
      'Tailwind CSS',
      'Bootstrap',
      'REST APIs',
      'Full Stack Development',
      'Web Development',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Cambodia',
    },
  };

  return (
    <div className="min-h-screen relative bg-gray-50 dark:bg-[#0a0a1a]">
      {/* Global animated particle network background - only in dark mode */}
      <div className="hidden dark:block">
        <ParticleNetwork />
      </div>

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      {/* Page content layered above particles */}
      <div className="relative z-[1]">
        <Routes>
        <Route path="/" element={<HomePage onOpenAuth={handleOpenAuth} onOpenSecurity={handleOpenSecurity} onOpenProfile={handleOpenProfile} />} />
        <Route
          path="/project/:slug"
          element={
            <ProjectDetail
              onOpenAuth={handleOpenAuth}
              onOpenSecurity={handleOpenSecurity}
              onOpenProfile={handleOpenProfile}
            />
          }
        />
        <Route path="/projects" element={<AllProjects />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/experiences" element={<AdminExperiences />} />
          <Route path="/admin/partners" element={<AdminPartners />} />
          <Route path="/admin/skills" element={<AdminSkills />} />
          <Route path="/admin/software-apps" element={<AdminSoftwareApps />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/socials" element={<AdminSocials />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/education" element={<AdminEducation />} />
          <Route path="/admin/achievements" element={<AdminAchievements />} />
        </Route>
        </Routes>
      </div>

      {/* Modals rendered at root level for proper fixed positioning */}
      <AuthModal isOpen={authModalOpen} onClose={handleCloseAuth} initialTab={authModalTab} />
      <SecurityModal isOpen={securityModalOpen} onClose={handleCloseSecurity} />
      <ProfileEditModal isOpen={profileModalOpen} onClose={handleCloseProfile} />
    </div>
  );
};

export default App;
