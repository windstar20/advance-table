import { memo, useCallback, useState } from "react";
import { updateValue } from "./utils/common";

function Hello({text}) {

    console.log('자식 렌더링...')
    const [name, setName] = useState('');

    const handleNameChang = useCallback((e) =>  {
        const updatedValue = updateValue(e.target.value)
        setName(name => updatedValue);
    }, []);

    return (
        <div>
           Hi  {text}
           <div>
            <h2>Chlid Hello component</h2>
            <input type={text} value={name} onChange={handleNameChang} />
           </div>
        </div>
    )
}

export default memo(Hello);