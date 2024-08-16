import React,{useState} from "react"


function VendorSell(){
      const [isApproved,setIsApproved] = useState(false)
     

    return (
        <>
          {
            isApproved?(
                <>
                   
                </>
            ):(
                <>
                </>
            )
          }

        </>
    )
}

export default VendorSell