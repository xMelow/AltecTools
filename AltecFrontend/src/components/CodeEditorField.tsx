import CodeMirror, { keymap, lineNumbers } from "@uiw/react-codemirror"

type CodeEditorFieldProps = {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    height?: string
    onEnterKey?: () => void
}

export default function CodeEditorField({
    value,
    onChange,
    placeholder,
    disabled,
    className,
    height,
    onEnterKey,
}: CodeEditorFieldProps) {
    
    const enterKeymap = keymap.of([
        {
            key: "Shift-Enter",
            run: () => {
                onEnterKey?.()
                return true
            },
        },
    ])

    const extensions = onEnterKey ? [lineNumbers(), enterKeymap] : [lineNumbers()];

    return (
        <CodeMirror
            value={value}
            placeholder={placeholder}
            editable={!disabled}
            className={className}
            height={height}
            onChange={(val) => onChange(val)}
            basicSetup={{ lineNumbers: false }}
            extensions={extensions}
        />
    )
}
