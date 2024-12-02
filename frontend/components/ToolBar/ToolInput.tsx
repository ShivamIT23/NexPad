export default function ToolInput({label , value, type = "number", onChange}:{label:string,value:number|string ,type?:string, onChange: (e: React.ChangeEvent<HTMLInputElement>)=>void}){
    return(
        <>
        <label className="text-sm text-gray-200">{label}</label>
              <input
                type={type}
                className={` ${type=="color"?"w-full":"w-fit"} mx-2 px-2 py-1 my-1 rounded bg-gray-700 text-white`}
                value={value}
                onChange={onChange}
              />
        </>
    )
}