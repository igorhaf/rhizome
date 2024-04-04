import React, { useState, useRef, useEffect } from 'react';
import './TabsComponent.css';

const TabsComponent = ({ tabsProp, activeTabProp, onTabChanged, onTabAdded }) => {
    const [tabs, setTabs] = useState(tabsProp || []);
    const [activeTab, setActiveTab] = useState(activeTabProp || 0);
    const [nextTabId, setNextTabId] = useState(tabs.length + 1);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const tabInputRef = useRef(null);
    const tabsWrapperRef = useRef(null);
    const [visibleTabLimit, setVisibleTabLimit] = useState(0);

    useEffect(() => {
        if (tabs.length > 0) {
            setNextTabId(Math.max(...tabs.map(tab => tab.id)) + 1);
        }

        const updateVisibleTabLimit = () => {
            const wrapperWidth = tabsWrapperRef.current.offsetWidth;
            const tabWidth = 100; // Largura ajustada para suas abas
            setVisibleTabLimit(Math.floor(wrapperWidth / tabWidth));
        };

        updateVisibleTabLimit(); // Inicializa o limite de abas visíveis
        window.addEventListener('resize', updateVisibleTabLimit); // Adiciona listener de redimensionamento

        return () => { // Limpeza do listener
            window.removeEventListener('resize', updateVisibleTabLimit);
        };
    }, [tabs]);

    const changeTab = (index) => {
        // Não precisa mais inverter o índice
        const newTabs = [...tabs];
        const selectedTab = newTabs.splice(index, 1)[0]; // Remove a aba clicada do array
        newTabs.unshift(selectedTab); // Insere a aba no início do array
        setTabs(newTabs); // Atualiza o estado com o novo array de abas
        setActiveTab(0); // A aba movida agora é a aba ativa
        if (onTabChanged) {
            onTabChanged(0); // Se necessário, chama o callback com o novo índice da aba ativa
        }
    };

    const addTab = () => {
        const newTab = {
            id: nextTabId,
            label: `Frame ${nextTabId}`,
            content: 'MxGraphComponent',
            isEditing: false
        };
        // Adiciona a nova aba no início do array
        setTabs([newTab, ...tabs]);
        setActiveTab(0); // Define a primeira aba (a mais recente) como ativa
        setNextTabId(nextTabId + 1);
        if (onTabAdded) {
            onTabAdded(newTab);
        }
    };

    const enableEdit = (tab) => {
        const updatedTabs = tabs.map(t => {
            if (t.id === tab.id) {
                return { ...t, isEditing: true };
            }
            return t;
        });
        setTabs(updatedTabs);
    };

    const saveTabName = (tab) => {
        const updatedTabs = tabs.map(t => {
            if (t.id === tab.id) {
                return { ...t, isEditing: false };
            }
            return t;
        });
        setTabs(updatedTabs);
    };

    const closeTab = (index) => {
        // Aqui você remove a aba baseando-se no novo índice
        const updatedTabs = [...tabs];
        updatedTabs.splice(index, 1);
        setTabs(updatedTabs);
        if (index === activeTab) {
            setActiveTab(0); // Se a aba fechada era a ativa, seleciona a primeira aba
        } else if (index < activeTab) {
            setActiveTab(activeTab - 1); // Ajusta a aba ativa se a aba fechada estava antes dela
        }
    };

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    // Verifica se há abas ocultas
    const hiddenTabs = tabs.length > visibleTabLimit;
    // As abas visíveis são agora as primeiras até o limite
    const visibleTabs = tabs.slice(0, visibleTabLimit);

    return (
        <div className="tabs-container">
            <div className="tabs-wrapper" ref={tabsWrapperRef}>
                <div onClick={addTab} className="add-tab">+</div>
                {visibleTabs.map((tab, index) => (
                    <div key={tab.id} className={`tab ${activeTab === index ? 'active-tab' : ''}`}
                         onClick={() => changeTab(index)}>
                        {tab.isEditing ? (
                            <input ref={tabInputRef} value={tab.label}
                                   onChange={(e) => saveTabName({ ...tab, label: e.target.value })}
                                   onBlur={() => saveTabName(tab)}
                                   className="tab-input" />
                        ) : (
                            <span>{tab.label}</span>
                        )}
                        <span onClick={(e) => { e.stopPropagation(); closeTab(index); }}
                              className="close-btn">X</span>
                    </div>
                ))}
                {hiddenTabs && <div className="dropdown-button" onClick={toggleDropdown}>⯆</div>}
            </div>
            {isDropdownVisible && (
                <div className="dropdown-menu">
                    {tabs.slice(visibleTabLimit).map((tab, index) => (
                        <div key={tab.id} onClick={() => {
                            changeTab(visibleTabLimit + index);
                            setIsDropdownVisible(false);
                        }}>
                            {tab.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TabsComponent;
