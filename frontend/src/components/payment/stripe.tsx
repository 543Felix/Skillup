import React,{useState} from 'react'
import {loadStripe} from  "@stripe/stripe-js"
import AxiosInstance from '../../../utils/axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import Loader from '../../pages/loader'

const MakePayment:React.FC =()=>{
    const [subscriptionType,setSubscriptionType] = useState({
        mode:'',
        price:0,
		validity:''
    })
	const [isLoading,setIsLoading] = useState<boolean>(false)
	const devId = useSelector((state:RootState)=>{
		return state.developerRegisterData._id
	})
    
	const navigate = useNavigate()
	
     
    const handlePayment = async(mode: string,price :number,validity:string)=>{
		// setIsLoading(true)
		setSubscriptionType({
			mode,
			price,
			validity
		})
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK)
        AxiosInstance.post(`/dev/create-checkout-session`,{subscriptionType:{
			mode,
			price,
			validity
		},devId})
        .then((response)=>{
			console.log(response.data)
          if(response.data.id){
            stripe?.redirectToCheckout({sessionId:response.data.id})
          }
        })
		
    }

    return(
        <>{
			isLoading===true?
			<Loader/>
			:
 <section className="absolute top-0  right-0 h-screen w-screen backdrop-blur-md z-[9999] py-10 text-gray-400">
			<div className='absolute right-4 '>
				<FontAwesomeIcon className='text-white h-8' icon={faCircleXmark} onClick={()=>navigate('/dev/job')} />
			</div>
	<div className=" flex flex-col justify-center items-center ">
		<div className="max-w-2xl mx-auto mb-10 text-center">
			<span className="font-bold tracking-wider uppercase text-violet-600">Pricing</span>
			<h2 className="text-4xl font-bold lg:text-5xl">Choose your best plan</h2>
		</div>
		<div className="flex flex-wrap justify-center items-stretch -mx-4">
			<div className="flex w-full mb-8 sm:px-4 md:w-1/2 lg:w-1/4 lg:mb-0">
				<div className={`flex flex-grow flex-col p-6 space-y-6 rounded shadow sm:p-8 ${subscriptionType.mode ==='Free'?'bg-violet text-white':'bg-white text-gray-700' } `}>
					<div className="space-y-2">
						<h4 className="text-2xl font-bold">Beginner</h4>
						<span className="text-6xl font-bold">Free</span>
					</div>
					<p className="mt-3 leading-relaxed ">Test mode</p>
					<ul className="flex-1 mb-6 ">
						<li className="flex mb-2 space-x-2">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-violet-600">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
							</svg>
							<span>Free job search</span>
						</li>
						<li className="flex mb-2 space-x-2">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-violet-600">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
							</svg>
							<span>upto 5 free applying</span>
						</li>
						{/* <li className="flex mb-2 space-x-2">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-violet-600">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
							</svg>
							<span>Tristique enim nec</span>
						</li> */}
					</ul>
					{/* <button type="button" className={`inline-block px-5 py-3 font-semibold tracking-wider text-center rounded ${subscriptionType.mode==='Free'?'bg-white text-violet':'bg-violet text-white'}`} disabled >Get Started</button> */}
				</div>
			</div>
			<div className="flex w-full mb-8 sm:px-4 md:w-1/2 lg:w-1/4 lg:mb-0">
				<div className={`flex flex-grow flex-col p-6 space-y-6 rounded shadow sm:p-8 ${subscriptionType.mode ==='Pro'?'bg-violet text-white':'bg-white text-gray-700' } `}>
					<div className="space-y-2">
						<h4 className="text-2xl font-bold">Pro</h4>
						<span className="text-6xl font-bold">$12
							<span className="text-sm tracking-wide">/month</span>
						</span>
					</div>
					<p className="leading-relaxed">Mostly used subscription</p>
					<ul className="flex-1 space-y-2">
						<li className="flex items-center space-x-2">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
							</svg>
							<span>Everything in Free</span>
						</li>
						<li className="flex items-center space-x-2">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
							</svg>
							<span>Upto 20 job appliying per month</span>
						</li>
					</ul>
<button type="button" className={`inline-block px-5 py-3 font-semibold tracking-wider text-center rounded ${subscriptionType.mode==='Pro'?'bg-white text-violet':'bg-violet text-white'}`}  onClick={()=>handlePayment('Pro',12,'1 month')}>Get Started</button>				</div>
			</div>
			<div className="flex w-full mb-8 sm:px-4 md:w-1/2 lg:w-1/4 lg:mb-0">
				<div className={`flex flex-grow flex-col p-6 space-y-6 rounded shadow sm:p-8 ${subscriptionType.mode ==='Premium'?'bg-violet text-white':'bg-white text-gray-700' } `}>
					<div className="space-y-2">
						<h4 className="text-2xl font-bold">Premium</h4>
						<span className="text-6xl font-bold">$100
							<span className="text-sm tracking-wide">/year</span>
						</span>
					</div>
					<p className="leading-relaxed ">Premium version subscription</p>
					<ul className="flex-1 space-y-2 ">
						<li className="flex items-start space-x-2">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-violet-600">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
							</svg>
							<span>Everything in Pro</span>
						</li>
						<li className="flex items-start space-x-2">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-violet-600">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
							</svg>
							<span>unlimited jop applying</span>
						</li>
						{/* <li className="flex items-start space-x-2">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-violet-600">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
							</svg>
							<span>Curabitur dictum</span>
						</li>
						<li className="flex items-start space-x-2">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-violet-600">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
							</svg>
							<span>Duis odio eros</span>
						</li>
						<li className="flex items-start space-x-2">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-violet-600">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
							</svg>
							<span>Vivamus ut lectus ex</span>
						</li> */}
					</ul>
<button type="button" className={`inline-block px-5 py-3 font-semibold tracking-wider text-center rounded ${subscriptionType.mode==='Premium'?'bg-white text-violet':'bg-violet text-white'}`} onClick={()=>handlePayment('Premium',100,'1 year')}>Get Started</button>				</div>
			</div>
		</div>
	</div>

         </section>
		}
        
        </>
       
    )
}
export default MakePayment