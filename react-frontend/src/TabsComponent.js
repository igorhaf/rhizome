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

    const onDragStart = (event, index) => {
        event.dataTransfer.setData("text/plain", index);
    };

    const onDragOver = (event) => {
        event.preventDefault(); // Permite que o elemento seja solto
    };

    const onDrop = (event, dropIndex) => {
        const dragIndex = Number(event.dataTransfer.getData("text/plain"));
        if (dragIndex === dropIndex) {
            return; // Se soltar na mesma posição, não faz nada
        }

        const newTabs = Array.from(tabs);
        const draggedTab = newTabs.splice(dragIndex, 1)[0];
        newTabs.splice(dropIndex, 0, draggedTab); // Insere a aba na nova posição
        setTabs(newTabs);

        setActiveTab(dropIndex); // Atualiza a aba ativa para a nova posição
    };

    const changeTab = (index) => {
        setActiveTab(index);
        if (onTabChanged) {
            onTabChanged(index);
        }
    };

    const addTab = () => {
        const newTab = {
            id: nextTabId,
            label: `Frame ${nextTabId}`,
            content: 'MxGraphComponent',
            isEditing: false
        };
        setTabs([newTab, ...tabs]);
        setActiveTab(0);
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

    const hiddenTabsExist = tabs.length > visibleTabLimit;

    // Verifica se há abas ocultas
    const hiddenTabs = tabs.length > visibleTabLimit;
    // As abas visíveis são agora as primeiras até o limite
    const visibleTabs = tabs.slice(0, visibleTabLimit);

    return (
        <div className="tabs-container">
            <div className="tabs-wrapper" ref={tabsWrapperRef} onDragOver={onDragOver}>
                <div onClick={addTab} className="add-tab">+</div>
                {tabs.map((tab, index) => (
                    <div key={tab.id} className={`tab ${activeTab === index ? 'active-tab' : ''}`}
                         draggable
                         onDragStart={(e) => onDragStart(e, index)}
                         onDragOver={onDragOver}
                         onDrop={(e) => onDrop(e, index)}
                         onClick={() => changeTab(index)}>
                        {tab.label}
                        <span onClick={(e) => { e.stopPropagation(); closeTab(index); }}
                              className="close-btn">X</span>
                    </div>
                ))}
                {hiddenTabsExist && <div className="dropdown-button" onClick={toggleDropdown}>⯆</div>}
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
