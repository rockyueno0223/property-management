import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const RootRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `http://localhost:3500/api/users/check-auth`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok && data.success) {
          navigate('/dashboard');
        } else {
          navigate('/signin');
        }
      } catch (error) {
        console.error(error);
        navigate('/signin');
      }
    }
    checkAuth();
  }, [navigate]);

  return null
}
