import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logoutUser, selectAuthUser, selectAuthLoading } from '../redux/authSlice';
import { toast } from 'react-toastify'
import LogoutModal from './LogoutModal';
import PillNav from './PillNav';
import LiquidEther from './LiquidEther';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const loading = useSelector(selectAuthLoading);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    const action = await dispatch(logoutUser());
    if (logoutUser.fulfilled.match(action)) {
      toast.success('Logged out successfully!', {
        position: 'top-right',
        autoClose: 2000,
      })
      setIsLogoutModalOpen(false);
      navigate('/login');
    } else {
      toast.error('Logout failed. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      })
    }
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  // Get username from user object, fallback to email part before @, or 'User'
  const username = user?.name || (user?.email ? user.email.split('@')[0] : 'User');

  // Navigation items for PillNav
  const navItems = [
    { label: 'Dashboard', href: '/view-subs' },
    { label: 'Add Subscription', href: '/addSubs' },
    { label: 'Settings', href: '/settings' },
    { 
      label: 'Sign Out', 
      href: '#logout',
      onClick: (e) => {
        e.preventDefault();
        handleLogoutClick();
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <LiquidEther 
          colors={['#5227FF', '#FF9FFC', '#B19EEF']} 
          mouseForce={20} 
          cursorSize={100} 
          autoDemo={true} 
        />
      </div>
      
      <div className="relative z-10">
        <PillNav
          logo="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
          logoAlt="Subscription Manager"
          items={navItems}
          activeHref={location.pathname}
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#1a0b2e"
          pillColor="#2d1b4e"
          hoveredPillTextColor="#FF9FFC"
          pillTextColor="#B19EEF"
          initialLoadAnimation={true}
        />

        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={handleLogoutCancel}
          onConfirm={handleLogoutConfirm}
          loading={loading}
        />
        
        <Outlet />
      </div>
    </div>
  )
}
