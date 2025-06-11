import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WhatshotIcon from '@mui/icons-material/Whatshot';
export default function NotFound() {
  const navigate = useNavigate();
  const [time, setTime]= useState(5);

  useEffect(()=>{
    if (time <= 0) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      setTime(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate, time])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 text-lg p-4">
      <p className='font-medium mb-2'><WhatshotIcon fontSize='small' /> Page Not Found</p>
       <span>Redirecting to home page in {time} seconds...</span>
      </div>
  )
}
