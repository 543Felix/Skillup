import React,{Dispatch,SetStateAction} from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
// import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

interface QuizProps{
  startQuiz:Dispatch<SetStateAction<boolean>>
}

const QuizInstruction: React.FC<QuizProps>  = ({startQuiz }) => {

  return (
       <div className="absolute bg-black h-screen w-screen flex justify-center items-center left-0 top-0 bottom-0 z-50">
<div className= " bg-black   backdrop-blur-xl bg-opacity-25 rounded-[20px] border shadow-md shadow-violet h-[32rem]  border-violet mx-5   p-3 font-serif text-white">
        {/* <div className="">
          <FontAwesomeIcon
            icon={faArrowLeftLong}
            className="ml-3 mt-2  h-[20px]"
            onClick={()=>{
              hideInstruction(false)
            }}
          />
        </div> */}
        <h1 className="flex justify-center underline underline-offset-4 text-[1.5rem]  lg:text-[2.3rem] font-semibold ">
          Quiz Assessment Instructions and Rules
        </h1>
          <div className="flex flex-grid items-center px-7 md:max-w-[850px] lg:max-w-[1250px] mt-1 mb-6">
            <img
              src="../company/quiz.png"
              className="lg:mx-8 md:mx-3 sm:h-[150px] md:h-[200px] lg:h-[270px]"
              alt="Quiz"
            />
            <div className=" p-6">
              <h1 className="lg:text-xl md:text-lg font-bold mb-3">Rules :</h1>
              <h2 className="sm:text-xs md:text-sm  mb-2">
                <span className="sm:text-sm text-md font-semibold">1. Integrity:</span> Attempt to
                answer each question honestly. Any attempt to cheat or
                manipulate the quiz will result in disqualification from the
                current selection process, and you will be ineligible to apply
                for the position in the future.
              </h2>
              <h2 className="sm:text-xs md:text-sm  mb-2">
                <span className="sm:text-sm text-base font-semibold">2. Time Allotment:</span> Each
                question will have a time limit of 30 seconds. Please manage
                your time effectively to answer each question within the given
                timeframe.
              </h2>
              <h2 className="sm:text-xs md:text-sm  mb-2">
                <span className="sm:text-sm text-base font-semibold">3. Participation:</span> We
                encourage you to attempt every question. There are no negative
                marks for incorrect answers, so feel free to respond to the best
                of your ability.
              </h2>
              <h2 className="sm:text-xs md:text-sm  mb-2">
                <span className="sm:text-sm text-base font-semibold">4. Interview Process:</span>{" "}
                Selected candidates may proceed to the next stage, which
                involves an interview with our HR team.
              </h2>
            </div>
          </div>
        <div className="flex items-center justify-center space-x-10">
        <span className="sm:text-lg text-xl font-bold font">Click on the button to get started</span>
        <button className="bg-violet px-5 py-1 rounded-[7px] font-bold" onClick={()=>startQuiz(true)}>Start Quiz</button>
        </div>
        
      </div>
       </div>
      
    // </div>
  );
};

export default QuizInstruction;
