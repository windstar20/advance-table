import TableContent from "./TableContent";
import TableOrigin from "./TableOrigin";

const tableHeaders = [
    "Items",
    "Order #",
    "Amount",
    "Status",
    "Delivery Driver"
];

function TableApp() {
    return (
    <>
        <TableOrigin
            headers={tableHeaders}
            minCellWidth={120}
            tableContent={<TableContent />}
        />
    </>
    )
}

export default TableApp;