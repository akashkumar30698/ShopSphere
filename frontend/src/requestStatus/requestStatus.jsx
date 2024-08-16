

export  default function RequestStatus({ isRequested = false}) {
  if (isRequested == undefined) {
    return null; 
  }
  if (!isRequested) {
    return null; 
  }
  return { isRequested }; 
}