import { Select, SelectProps } from '@chakra-ui/react'
import { Moves } from '../../contexts/GameContext'

interface Props extends SelectProps {}

export default function SelectMove({ ...props }: Props): JSX.Element {
    return (
        <Select fontWeight="bold" {...props}>
            {Object.values(Moves).map((key, index) => (
                <option key={key} value={index + 1}>
                    {key}
                </option>
            ))}
        </Select>
    )
}
