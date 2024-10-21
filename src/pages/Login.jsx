import  { useState } from 'react';
import Container from '../components/Container';
import { Link,  useNavigate } from 'react-router-dom';

import { FaEye } from 'react-icons/fa';
import { IoMdEyeOff } from 'react-icons/io';
import useAuth from '../hooks/useAuth';
import PasswordResetModal from '../components/modal/PasswordResetModal';


const Login = () => {
    const { signIn,signInWithGoogle, setLoading } = useAuth()
    const [showpassword, setshowpassword] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate();
    const from = location?.state || "/";
	


    const handleSubmit = async e => {
        e.preventDefault()
        const form = e.target
        const email = form.email.value
        const password = form.password.value

        try {
             await signIn(email, password)
          
            navigate(from)
           
        } catch (err) {
            setLoading(false)
            console.log(err.message);
          
        }

    }
    const handleSocialLogin = async (socialProvider) => {
        setLoading(true);
        try {
          const result = await socialProvider();
          console.log(result);
        //   if (result.user) {
            navigate('/'); 
            console.log('successful');// Redirect after login
        //   }
        } catch (error) {
          console.error("Social login failed:", error);
        } finally {
            setLoading(false);
        }
      };
      
    
    return (
        <div>
           
            <Container>
                <div className='mt-16 md:mt-[120px]'>
                    <div className='w-full md:w-[544px] py-[50px] px-[56px] mx-auto' style={{
                        boxShadow: '0px 0px 25px 10px rgb(248, 248, 251)',
                    }}>
                        <h2 className='text-[32px] font-josefin font-bold text-block text-center'>Login</h2>
                        <p className='text-[#9096B2] text-lg font-josefin font-normal text-center'>Please login using account detail bellow.</p>
                        <form onSubmit={handleSubmit} action="" >
                            <div className='flex flex-col mt-9'>
                                <input type="email" name='email' placeholder='Email Address' className='w-full outline-0 py-[13px] px-4 border border-[#C2C5E1] text-[#9096B2]' />
                                <div className='relative'>
                                    <input type={showpassword ? "text" : "password"} name='password' placeholder='Password' className='w-full outline-0 mt-[22px] py-[13px] px-4 border border-[#C2C5E1] text-[#9096B2]' />
                                    <span className="absolute right-3 top-1/2" onClick={() => setshowpassword(!showpassword)}>
                                        {showpassword ? <FaEye className="text-gray-900"></FaEye> : <IoMdEyeOff className="text-gray-900"></IoMdEyeOff>}
                                    </span>
                                </div>
                            </div>
                            <button onClick={()=>setIsOpen(!isOpen)} className='text-[#9096B2] text-[17px] font-josefin font-normal mt-[13px]'>Forgot your password?</button>
                            <button className="block mt-6 w-full  text-[16px] font-josefin font-semibold py-3 px-5 bg-[#FB2E86] text-white rounded-sm  capitalize">Sign In</button>
                    <PasswordResetModal setIsOpen={setIsOpen} isOpen={isOpen}></PasswordResetModal>
                            
                        </form>
                        <div>
                        <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => handleSocialLogin(signInWithGoogle)}
                            aria-label="Log in with Google" className="p-3 rounded-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current text-gray-900">
                                <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                            </svg>
                        </button>

                        {/* <button
                            onClick={() => handleSocialLogin(githubLogin)}
                            aria-label="Log in with GitHub" className="p-3 rounded-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current text-gray-900">
                                <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z"></path>
                            </svg>
                        </button> */}
                    </div>
                        </div>
                        <Link to='/registation' className='flex justify-center items-center '>  <button className='text-[#9096B2]  text-[17px] font-josefin font-normal mt-[28px]  '>Don’t have an Account? <span className='text-[#1D3178]'>Create account</span> </button></Link>
                        
                           
                            
                    </div>
                </div>
            </Container>
        

        </div>
    );
};

export default Login;