import React, { useState, useEffect, useRef} from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
// import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import AxiosInstance from "../../../utils/axios";


export interface QuestionsData {
  question: string;
  options: string[];
  answer: string;
}

interface MyComponentProps {
  jobId?:string;
  Quiz?:{
    questions:QuestionsData[];
    passingScore:number
  }
}


const AddQuestions:React.FC<MyComponentProps> = ({jobId,Quiz}) => {
  const [questionsData, setQuestionData] = useState<QuestionsData>({
    question: '',
    options: ['', '', '', ''],
    answer: ''
  });
  const [editMode,setEditMode] = useState<boolean>(false)
  const [questions,setQuestions] = useState<QuestionsData[]>([]);
  const [index,setIndex] = useState(-1)
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const  [passingScoreComponent,setPassingScorecomponnt]  = useState(false)
  const [passingScore,setPassingScore]  = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

 useEffect(()=>{
  if(Quiz?.questions?.length){
    setQuestions(Quiz?.questions)
    setPassingScore(Quiz?.passingScore)
  }
 },[Quiz])
   const validation =()=>{
    if (questions.some((q,i) => q.question.trim().toLowerCase() === questionsData.question.trim().toLowerCase()&&i!==index)) {
      return 'This question already exists. Add another question.'
      
    }
    if (questions.length >= 10&&editMode===false) {
      return 'You can only have exactly 10 questions for the quiz.'
      
    }
    if (!questionsData.question.trim()) {
      return'Please add a question.'
      
    }
    if (questionsData.options.some(option => !option.trim())) {
      return '4 options are mandatory for this form.'
    }
    if (!questionsData.answer.trim()) {
      return 'Answer field is mandatory for this form.'
    }
    if (new Set(questionsData.options.map(item => item.trim().toLowerCase())).size < 4) {
      return 'Every option should be unique.'
    }
    return null
   }
  const addQuestion = () => {
    const  errorMessage = validation()
    if(errorMessage===null){
      if(questions.length===9){
        setPassingScorecomponnt(true)
      }
      if(questions.length<10){
        setQuestions([...questions, questionsData]);
        setQuestionData({
          question: '',
          options: ['', '', '', ''],
          answer: ''
        });
      }
      
    }else{
      toast.error(errorMessage)
    }
    
  };

  const handleEditQuestion = ()=>{
    const  errorMessage = validation()
    if(errorMessage===null){
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1, questionsData);
    setIndex(-1)
    setQuestions(updatedQuestions);
    setQuestionData({
      question: '',
      options: ['', '', '', ''],
      answer: ''
    });
    setEditMode(false)
  }else{
    toast.error(errorMessage)
  }
  }

  const handleChange = (field: string, value: string) => {
    if (field.length === 1) {
      const index = Number(field);
      setQuestionData(prevState => {
        const newOptions = [...prevState.options];
        newOptions[index] = value;
        return { ...prevState, options: newOptions };
      });
    } else {
      setQuestionData(prevState => ({ ...prevState, [field]: value }));
    }
  };

  const removeQuestion = (index: number) => {
    setRemovingIndex(index);
  };


 const editQuestion = (i:number)=>{
  setIndex(i)
  setEditMode(true)
  const data = questions[i]
  setQuestionData(()=>data)
 }
 

  useEffect(() => {
    if (removingIndex !== null) {
      const timeout = setTimeout(() => {
        setQuestions(prevQuestions => prevQuestions.filter((_, i) => i !== removingIndex));
        setRemovingIndex(null);
      }, 300); // Duration of the removal animation
      return () => clearTimeout(timeout);
    }
  }, [removingIndex]);

  useEffect(() => {
    if (containerRef.current) {
      const buttons = Array.from(containerRef.current.children) as HTMLElement[];
      buttons.forEach((button, index) => {
        setTimeout(() => {
          button.classList.add('animate-slideDown');
        }, index * 800); // Stagger the slide-down animation
      });
    }
  }, [questions]);

  

  

  const handlePassingScoreChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const val= Number(target.value)
    if(val>0&&val<=10){
      setPassingScore(val);
    }else{
      toast.error('Score should be a number between 0 and 11')
    }
    
  };
  const submitQuestion=()=>{
    if(questions.length===10){
     AxiosInstance.post(`/job/createQuiz/${jobId}`,{questions,passingScore})
     .then((res)=>{ 
      setQuestions([])
      setPassingScore(0)
       toast.success(res.data.message)
     })
     .catch((error)=>{
      toast.error(error.response.data.message)
     })


    }else{
      toast.error('There must be 10 questions ')
    }
    }
 
  return (
    <>
      <div className="w-[700px]  mx-10  my-16 "> 
      <div className="flex justify-between  mx-2">
        <h3 className="text-gray-400">Note: Add exactly 10 questions for the quiz</h3>
        {/* <FontAwesomeIcon className="text-white h-7" icon={faCircleXmark} onClick={()=>closeQues()} /> */}
      </div>
      <div className="relative h-[330px] mb-5">
        <div className="pl-2 pr-[100px] items-center mr-4">
          <label htmlFor="question" className="self-start text-white mb-1">Question</label>
          <textarea
            value={questionsData.question}
            id="question"
            className="w-full mb-2 p-2 h-[80px] focus:outline-none resize-none"
            placeholder="Enter a question"
            onChange={(e) => handleChange('question', e.target.value)}
          ></textarea>
          <div className="grid grid-cols-2 gap-x-2 w-full mb-4">
            <div className="flex flex-col">
              <label htmlFor="option1" className="text-white">Option A</label>
              <input
                id="option1"
                className="w-full h-[38px] focus:outline-none"
                placeholder="Enter option A"
                type="text"
                value={questionsData.options[0]}
                onChange={(e) => handleChange('0', e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="option2" className="text-white">Option B</label>
              <input
                id="option2"
                className="w-full h-[38px] focus:outline-none"
                placeholder="Enter option B"
                type="text"
                value={questionsData.options[1]}
                onChange={(e) => handleChange('1', e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="option3" className="text-white">Option C</label>
              <input
                id="option3"
                className="w-full h-[38px] focus:outline-none"
                placeholder="Enter option C"
                type="text"
                value={questionsData.options[2]}
                onChange={(e) => handleChange('2', e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="option4" className="text-white">Option D</label>
              <input
                id="option4"
                className="w-full h-[38px] focus:outline-none"
                placeholder="Enter option D"
                type="text"
                value={questionsData.options[3]}
                onChange={(e) => handleChange('3', e.target.value)}
              />
            </div>
          </div>
          <label htmlFor="answer" className="self-start text-white flex">Answer</label>
          <select
            id="answer"
            className="w-1/2 self-start focus:outline-none h-10"
            value={questionsData.answer}
            onChange={(e) => handleChange('answer', e.target.value)}
          >
            <option value="" disabled>Select an option</option>
            {questionsData.options.map((option, index) => (
              <option key={index} value={option}>{`Option ${String.fromCharCode(65 + index)}`}</option>
            ))}
          </select>
          <button
            onClick={editMode ? handleEditQuestion : addQuestion}
            className="bg-violet rounded-[8px] ml-[50px] text-white px-3 py-1 mt-2"
          >
            {editMode ? 'Update Question' : 'Add Question'}
          </button>
          {passingScoreComponent&&
          <>
           <input type="number"  min={'1'} max={'10'} value={passingScore===0?'':passingScore} className="placeholder:text-slate-600 mt-2 w-[200px]" placeholder="Enter passing Score" onChange={handlePassingScoreChange}/>
          {/* <button className="text-white bg-black border-2 ml-4 border-violet px-4 py-[6px]  rounded-[8px]">Add </button> */}
          </>
         
          }
          </div>
        <div ref={containerRef} className="h-[286px] my-4 w-[100px] border border-white absolute right-0 top-4 overflow-hidden flex flex-col-reverse">
          {questions?.length>0&&questions.map((_, index) => (
            <button
              key={index}
              className={`bg-violet flex justify-between items-center text-white px-2 mr-1 mb-1 mx-1 ${
                removingIndex === index ? 'animate-zoomOut' : ''
              }`}
              onClick={()=>editQuestion(index)}
             
            >
              Q{index + 1}
              <FontAwesomeIcon icon={faXmark} className="text-white"  onClick={(event) => {
              event.stopPropagation();
              removeQuestion(index);
            }}/>
            </button>
          ))}
        </div>
      </div> 
      {/* <div className="flex justify-end ">
      {questions.length ===10&&(<button className="bg-violet px-3 py-1 text-white font-semibold mr-10 rounded-[8px]" onClick={submitQuestion}>Create</button>)}
      <button className="bg-violet px-3 py-1 text-white font-semibold mr-10 rounded-[8px]">Skip this part</button>
      </div> */}
     
      </div>
      <div className="py-10 border-t flex justify-end px-5">
        {/* <button className="px-5 py-1 bg-violet text-white rounded-[5px]">Back</button> */}
        {questions?.length===10? <button className="px-5 py-1 bg-violet text-white rounded-[5px]" onClick={submitQuestion}>Submit</button>
        :
        <button className="px-5 py-1 bg-violet text-white rounded-[5px]">Skip</button>
        }
      </div>
                                      
    </>
  );
};

export default AddQuestions;
