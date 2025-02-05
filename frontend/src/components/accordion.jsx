import { useLogin } from "../ContextApi/loginContext"
import { items } from "../data/items"
import AccordionItem from "./AccordionItem"
import "../App.css"

export default function Accordion() {
  const { selectedCategory } = useLogin()

  if (!selectedCategory || !items[selectedCategory]) {
    return <div>No category selected or invalid category.</div>
  }

  return (
    <div className="accordion-container width">
      <div className="accordion-content">
        {items[selectedCategory].map((item, index) => (
          <AccordionItem key={index} item={item} isLast={index === items[selectedCategory].length - 1} />
        ))}
      </div>
    </div>
  )
}

