import{r as c,u as _,A as u,j as e,F as A,f as I,X as $,Y as E,B as w,Z as P,$ as T}from"./index-Do9RfUXn.js";const M=({jobId:i,jobName:d,hidePage:h})=>{const[x,p]=c.useState([]),[m,g]=c.useState(""),[j,f]=c.useState(""),[y,k]=c.useState(""),[v,S]=c.useState(""),[C,N]=c.useState(!1),b=_(t=>t.companyRegisterData._id),s=["rejected","selected","shortListed"];c.useEffect(()=>{u.get(`/job/appliedDevelopers/${i}`).then(t=>{console.log("data = ",t.data.data),p(t.data.data)}).catch(t=>{console.log("error = ",t)})},[i]);const a=(t,l)=>{console.log("devId = ",l),l?u.patch(`/job/changeProposalStatus/${i}`,{status:t,devId:l}).then(o=>{const J=[...x].map(D=>D.developer._id===l?{...D,status:t}:D);p(J),E.emit("notification",{senderId:b,receiverId:l,content:`your job proposal for ${d} got ${t} `}),w.success(o.data.message)}).catch(o=>{w.error(o.response.data.message)}):console.log("Developer ID is undefined")},n=(t,l)=>{const o=t.target.value;S(o),a(o,l)},r=t=>{g(t._id),f(t.image),k(t.name),N(!0)};return C===!1?e.jsx("div",{className:"col-span-12 w-full",children:e.jsx("div",{className:"grid gap-2 grid-cols-1 lg:grid-cols-1",children:e.jsxs("div",{className:"bg-black p-4 shadow-lg rounded-lg",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("h1",{className:"font-bold text-white text-xl",children:" Applied Developers"}),e.jsx(A,{className:"text-white h-7",icon:I,onClick:h})]}),e.jsx("div",{className:"mt-4",children:e.jsx("div",{className:"flex flex-col",children:e.jsx("div",{className:"-my-2 overflow-x-auto",children:e.jsx("div",{className:"py-2 align-middle inline-block min-w-full",children:e.jsx("div",{className:"shadow overflow-hidden  sm:rounded-lg ",children:x.length>0?e.jsxs("table",{className:"min-w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider",children:e.jsx("div",{className:"flex cursor-pointer",children:e.jsx("span",{className:"mr-2",children:"NAME"})})}),e.jsx("th",{className:"px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider",children:e.jsx("div",{className:"flex cursor-pointer",children:e.jsx("span",{className:"mr-2",children:"Email"})})}),e.jsx("th",{className:"px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider",children:e.jsx("div",{className:"flex cursor-pointer",children:e.jsx("span",{className:"mr-2",children:"Cover Letter"})})}),e.jsx("th",{className:"px-6 py-3 bg-black    text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider",children:e.jsx("div",{className:"flex cursor-pointer",children:e.jsx("span",{className:"mr-2",children:"STATUS"})})}),e.jsx("th",{className:"px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider",children:e.jsx("div",{className:"flex cursor-pointer",children:e.jsx("span",{className:"mr-2",children:"ACTION"})})}),e.jsx("th",{className:"px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider",children:e.jsx("div",{className:"flex cursor-pointer",children:e.jsx("span",{className:"mr-2"})})})]})}),e.jsx("tbody",{className:"bg-black ",children:x.map(t=>e.jsxs("tr",{children:[e.jsx("td",{className:"px-6 py-4 text-white whitespace-no-wrap text-sm leading-5",children:e.jsx("p",{children:t?.developer.name})}),e.jsx("td",{className:"px-6 py-4 text-white whitespace-no-wrap text-sm leading-5",children:e.jsx("p",{children:t?.developer.email})}),e.jsx("td",{className:"px-6 py-4 text-white whitespace-no-wrap text-sm leading-5",children:e.jsx("p",{children:"view cover Letter"})}),e.jsx("td",{className:"px-6 py-4 whitespace-no-wrap text-sm leading-5",children:e.jsx("div",{className:`${t.status==="selected"?"text-green-500":t.status==="rejected"?"text-red-500":"text-orange"}  `,children:e.jsx("p",{children:t.status})})}),e.jsx("td",{className:"px-6 py-4 flex justify-center items-center whitespace-no-wrap text-sm leading-5",children:e.jsx("select",{className:"text-white items-center bg-black",name:"status",value:v,id:"",onChange:l=>n(l,t.developer._id),children:s.length>0&&s.map((l,o)=>e.jsx("option",{value:l,onClick:()=>a(l,t.developer._id),children:l},o))})}),e.jsx("td",{children:e.jsx("button",{className:"bg-violet px-4 py-1 text-white rounded-[5px] font-semibold",onClick:()=>r(t.developer),children:"Message"})})]}))})]}):e.jsx("div",{className:"flex justify-center text-white text-3xl font-semibold py-5",children:e.jsx("h1",{children:"No one applied for the job"})})})})})})})]})})}):e.jsx("div",{className:"absolute z-50 h-screen w-screen top-0 bottom-0 left-0 right-0",children:e.jsx($,{role:"companies",senderId:b,senderModel:"companies",receiverModel:"developers",receiverId:m,profileImg:j,name:y,closeChat:N})})},L=()=>{const i=_(s=>s.companyRegisterData._id),[d,h]=c.useState([]),[x,p]=c.useState(""),[m,g]=c.useState(!1),[j,f]=c.useState(!1),[y,k]=c.useState("");c.useEffect(()=>{i&&u.get(`/job/company/${i}`).then(s=>{console.log("jobs = ",s.data.response),h(s.data.response)}).catch(s=>{console.error("Error fetching data: ",s)})},[i,m]);const v=(s,a,n)=>{s.stopPropagation(),u.patch(`/job/setStatus?id=${n}`,{status:a}).then(r=>{if(r.data.message){const t=d.map(l=>l._id===n?{...l,status:a}:l);console.log(t),h(t),w.success(r.data.message)}}).catch(r=>{console.log(r)})},S=s=>{p(s),g(!0)},C=(s,a)=>{s.stopPropagation(),u.delete(`/job/deleteJob/${a}`).then(n=>{const r=d.filter(t=>t._id!==a);h(r),w.success(n.data.message)}).catch(n=>{console.log(n)})},N=(s,a,n)=>{s.stopPropagation(),console.log(""),p(a),k(n),f(!0)},b=()=>{p(""),f(!1)};return e.jsx(e.Fragment,{children:m===!1&&j===!1?e.jsx("div",{className:"",children:d.length>0&&d.map(s=>e.jsxs("div",{className:"bg-slate-600 bg-opacity-[5%] rounded-[15px] shadow-custom-black h-[280px] w-[730px] mt-[15px] px-5 py-3 text-white",onClick:()=>S(s._id),children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("h1",{className:"text-2xl font-bold",children:s.jobTitle}),e.jsxs("div",{className:"flex space-x-2 items-center",children:[s.status==="open"?e.jsx("button",{className:"bg-violet text-xs px-2 py-1 rounded-[5px]",onClick:a=>v(a,"closed",s._id),children:"Close  vaccancy"}):s.status==="closed"?e.jsx("button",{className:"bg-violet text-xs  rounded-[5px] px-2 py-1",onClick:a=>v(a,"open",s._id),children:"open  vaccany"}):"",e.jsx(A,{className:"text-white h-5",icon:P,onClick:a=>C(a,s._id)})]})]}),e.jsx("div",{children:e.jsx("h1",{className:"mt-2 max-h-[70px] overflow-y-auto",children:s.description})}),e.jsx("div",{className:"mt-3 h-[80px] overflow-y-auto ",children:s.skills.length>0&&s.skills.map((a,n)=>e.jsx("button",{className:"bg-transparent mt-1 border-violet border-2 rounded-[8px] mr-[5px] px-4 py-[3px]",children:a},n))}),e.jsx("div",{className:" my-4 flex justify-end space-x-2 ",children:e.jsx("button",{className:"bg-violet text-white px-5 py-1 font-semibold rounded-[5px]",onClick:a=>N(a,s._id,s.jobTitle),children:"Show Applied Developers"})})]},s._id))}):m===!0?e.jsx(T,{action:"editJob",jobId:x,setShowData:g}):j===!0?e.jsx(M,{jobId:x,jobName:y,hidePage:b}):e.jsx(e.Fragment,{})})};export{L as default};