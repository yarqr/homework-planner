import React, {FC} from "react";
import { InputField } from "../UI/InputField";

interface Props {
    navigateFunction: () => void

}

export const AuthWindow: FC<Props> = ({navigateFunction}) => {
    return (
        <section>
            <InputField type="text" onChange={() => {}}/> 
            <InputField type="text" onChange={() => {}}/>
        </section>
    )
}