import Swal from "sweetalert2";
import "@sweetalert2/theme-dark/dark.css";

export const question = async (title: string, d: string): Promise<string> => {
    const res = await Swal.fire<string>({
        title,
        input: "text",
        inputValidator: v => !(v.trim()) ? "this is required tysm" : null,
        inputValue: d,
        allowEscapeKey: false,
        allowOutsideClick: false,
        icon: "question"
    });
    
    return res.value as string;
}