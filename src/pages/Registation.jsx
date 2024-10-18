import  { useState } from 'react';

import Container from '../components/Container';
import { Link, useNavigate } from 'react-router-dom';

import { FaEye } from 'react-icons/fa';
import { IoMdEyeOff } from 'react-icons/io';
import useAuth from '../hooks/useAuth';
import Swal from 'sweetalert2';
// import { useAddUserMutation } from '../Featured/auth/authApi';


const Registation = () => {
    // const dispatch = useDispatch();
    // const[AddUser]=useAddUserMutation();
    const [showpassword, setshowpassword] = useState(null)
    const navigate = useNavigate()
    const { createUser } = useAuth()

    const handleSubmit = async e => {
        e.preventDefault()

        const form = e.target
      
        const name = form.name.value
        const email = form.email.value
        const password = form.password.value
        

        // const userinfo = {
        //     firstName: firstName,
        //     lastName: lastName,
        //     email: email,
        // }
        let pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        let lowerChar = /^(?=.*[a-z])/
        let upperChar = /^(?=.*[A-Z])/
        let number = /^(?=.*[0-9])/
        let specil = /^(?=.*[!@#$%^&*])/
        let minMax = /^(?=.{8,})/

        if (!email) {
            // setEmailError("Enter your email");
            Swal.fire({
				position: "top-end",
				icon: "error",
				title: "Enter your email",
				showConfirmButton: false,
				timer: 1500
			});
        
        } else if (!pattern.test(email)) {
            // setEmailError("Enter a Valid Email");
            Swal.fire({
				position: "top-end",
				icon: "error",
				title: "Enter a Valid Email",
				showConfirmButton: false,
				timer: 1500
			});
        }
        else if (!name) {
            // setFullNameError("Enter YouFull Name");
            Swal.fire({
				position: "top-end",
				icon: "error",
				title: "Enter YouFull Name",
				showConfirmButton: false,
				timer: 1500
			});
        }
        else if (!password) {
            // setPasswrdError("Enter a password");
            Swal.fire({
				position: "top-end",
				icon: "error",
				title: "Enter a password",
				showConfirmButton: false,
				timer: 1500
			});
        } else if (!lowerChar.test(password)) {
            // setPasswrdError("Lower Case Must");
            Swal.fire({
				position: "top-end",
				icon: "error",
				title: "Lower Case Must",
				showConfirmButton: false,
				timer: 1500
			});
           
        } else if (!upperChar.test(password)) {
            // setPasswrdError("Upper Case Must");
            Swal.fire({
				position: "top-end",
				icon: "error",
				title: "Upper Case Must",
				showConfirmButton: false,
				timer: 1500
			});
          
        } else if (!number.test(password)) {
            // setPasswrdError("Number Must");
            Swal.fire({
				position: "top-end",
				icon: "error",
				title: "Number Must",
				showConfirmButton: false,
				timer: 1500
			});
        } else if (!specil.test(password)) {
            // setPasswrdError("Specil charator Must");
            Swal.fire({
				position: "top-end",
				icon: "error",
				title: "Specil charator Must",
				showConfirmButton: false,
				timer: 1500
			});
        } else if (!minMax.test(password)) {
            // setPasswrdError("min-8 max-16");
            Swal.fire({
				position: "top-end",
				icon: "error",
				title: "min-8 max-16",
				showConfirmButton: false,
				timer: 1500
			});
            return
        }

        try {
             await createUser(name,email, password)
            navigate('/')
        }
        catch (error) {
          console.log(error.message);
        }
    }


    return (
        <div>
          
            <Container>
                <div className='mt-16 md:mt-[120px]'>
                    <div className='w-full md:w-[544px] py-[50px] px-[56px] mx-auto' style={{
                        boxShadow: '0px 0px 25px 10px rgb(248, 248, 251)',
                    }}>
                        <h2 className='text-[32px] font-josefin font-bold text-block text-center'>Registation</h2>
                        <p className='text-[#9096B2] text-lg font-josefin font-normal text-center'>Please Fill In Your Personal Information</p>
                        <form onSubmit={handleSubmit} action=""  >
                            <div className='flex flex-col mt-9'>

                                <input type="text" name='name' placeholder='Full  name ' className='w-full outline-0 py-[13px] px-4 border border-[#C2C5E1] text-[#9096B2]' />
                                <input type="email" name='email' placeholder='Email Address' className='w-full mt-[22px] outline-0 py-[13px] px-4 border border-[#C2C5E1] text-[#9096B2]' />
                                <div className='relative'>
                                    <input type={showpassword ? "text" : "password"} name='password' placeholder='Password' className='w-full outline-0 mt-[22px] py-[13px] px-4 border border-[#C2C5E1] text-[#9096B2]' />
                                    <span className="absolute right-3 top-1/2" onClick={() => setshowpassword(!showpassword)}>
                                        {showpassword ? <FaEye className="text-gray-900"></FaEye> : <IoMdEyeOff className="text-gray-900"></IoMdEyeOff>}
                                    </span>
                                </div>
                            
                            </div>

                            <button type='submit' className="block mt-6 w-full  text-[16px] font-josefin font-semibold py-3 px-5 bg-[#FB2E86] text-white rounded-sm  capitalize">Sign up</button>

                            <Link to="/login" className='flex justify-center items-center '>  <button className='text-[#9096B2]  text-[17px] font-josefin font-normal mt-[28px]  '>Already have an Account? <span className='text-[#1D3178]'>sign in</span> </button></Link>
                        </form>
                    </div>
                </div>
            </Container>
          
        </div>
    );
};

export default Registation;