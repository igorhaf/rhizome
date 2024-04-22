import React from 'react';

function WelcomeScreen() {
    const recentProjects = [
        { id: 1, name: "Automação de Relatórios" },
        { id: 2, name: "Integração de Sistemas" },
        { id: 3, name: "Monitoramento de APIs" }
    ];
    const updates = "Última atualização em 20/04/2024";

    return (
        <div className="bg flex flex-col items-center h-screen p-4 text overflow-scroll">
            <div>
                <div className="logo-welcome"></div>
            </div>
            <RecentProjects projects={recentProjects} />

        </div>
    );
}

function RecentProjects() {
    return (
        <div className="w-full max-w-4xl mt-8 ">
            <h3 className="text-lg py-6 leading-6 font-medium text">Bem-vindo ao Nexabuild</h3>

            <div>Nexabuild é uma ferramenta de automação low-code baseada em fluxos que permite a integração entre APIs
                de forma visual e interativa. Arraste e solte nós representando diferentes funcionalidades e lógicas
                para criar processos de automação complexos. Nexabuild suporta extensões customizadas através de
                JavaScript, possibilitando a integração com uma ampla gama de sistemas externos e APIs. O controle de
                versão integrado facilita a gestão de mudanças e colaboração.

                Explore as possibilidades ilimitadas de automação com Nexabuild e otimize seus processos operacionais
                agora.
            </div>
            <h3 className="text-lg py-6 leading-6 font-medium text">Últimas Atualizações:</h3>
            <h2 className="text py-4 leading-4 font text">21/04/2014</h2>

            <ul className="mt-4">
                <li className="py-2 border-b border-gray-200">Novas features de tab</li>
                <li className="py-2 border-b border-gray-200">Novo formulario</li>
                <li className="py-2 border-b border-gray-200">Novo formulario</li>
                <li className="py-2 border-b border-gray-200">Novo formulario</li>
                <li className="py-2 border-b border-gray-200">Novo formulario</li>
                <li className="py-2 border-b border-gray-200">Novo formulario</li>
                <li className="py-2 border-b border-gray-200">Novo formulario</li>
                <li className="py-2 border-b border-gray-200">Novo formulario</li>
                <li className="py-2 border-b border-gray-200">Novo formulario</li>
                <li className="py-2 border-b border-gray-200">Novo formulario</li>
                <li className="py-2 border-b border-gray-200">Novo formulario</li>
            </ul>
        </div>
    );
}

export default WelcomeScreen;
