
  
  export default function AccordionItem({ item, isLast }) {
    return (
      <a href="#" className={`accordion-item ${isLast ? "last-item" : ""}`}>
        <div className="item-content">
          <p className="item-name">{item.name}</p>
        </div>
        <data value={item.stock} title="Available Stock" className="item-stock">
          {item.stock}
        </data>
      </a>
    )
  }
  
  