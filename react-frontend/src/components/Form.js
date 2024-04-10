// Form.js
import Text from './Text';
import Select from './Select';
import Textarea from './Textarea';

function Form() {
    return (
        <div className="w-full ">
            <form>
                <Text label="Nome" name="nome" placeholder="Seu nome" />
                <div className="flex">
                    <Text label="Nome" name="nome" placeholder="Seu nome" />
                    <Select
                        label="Seleção"
                        name="selecao"
                        options={[
                            { value: 'opcao1', label: 'Opção 1' },
                            { value: 'opcao2', label: 'Opção 2' },
                        ]}
                    />
                    <Text label="Sobrenome" name="sobrenome" placeholder="Seu sobrenome" />
                </div>
                <Textarea label="Mensagem" name="mensagem" placeholder="Digite sua mensagem" />
                <Select
                    label="Seleção"
                    name="selecao"
                    options={[
                        { value: 'opcao1', label: 'Opção 1' },
                        { value: 'opcao2', label: 'Opção 2' },
                    ]}
                />
            </form>
        </div>
    );
}

export default Form;
