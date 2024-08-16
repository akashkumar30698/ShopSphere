export default  function RequestDetails({ id, gst, name, email }) {

    if(!id || !gst || !name || !email){
       return null 
    }
    return { id, gst, name, email };
}

