'use client'
import HomeSearch from "../search/HomeSearch";
import { Icon } from '@iconify/react';
import { useState, useEffect, useRef } from "react";
const HomeNav = () => {
    const dropdownRef = useRef<any>(null);
    const menu = [
        {
            isActive: true,
            featured: true,
            label: "All Categories",
            icon: {
                name: "game-icons:hamburger-menu",
                position: "left",
            },
            expand_trigger: "hover", // click or hover
            child: [
                { featured: true, label: "Featured Category 1", url: "#" },
                { featured: true, label: "Featured Category 2", url: "#" },
                { featured: true, label: "Featured Category 3", url: "#" },
                {
                    featured: false, label: "Fireplace Category 1", url: "#", child: [
                        {
                            label: "FireplateCat1 Category1",
                            items: [
                                { label: "FC1C1 Item1", url: "#" },
                                { label: "FC1C1 Item2", url: "#" },
                                { label: "FC1C1 Item3", url: "#" },
                                { label: "FC1C1 Item4", url: "#" },
                                { label: "FC1C1 Item5", url: "#" },
                                { label: "FC1C1 Item6", url: "#" },
                            ]
                        },
                        {
                            label: "FireplateCat1 Category2",
                            items: [
                                { label: "FC1C2 Item1", url: "#" },
                                { label: "FC1C2 Item2", url: "#" },
                                { label: "FC1C2 Item3", url: "#" },
                                { label: "FC1C2 Item4", url: "#" },
                                { label: "FC1C2 Item5", url: "#" },
                                { label: "FC1C2 Item6", url: "#" },
                            ]
                        },
                        {
                            label: "FireplateCat1 Category3",
                            items: [
                                { label: "FC1C3 Item1", url: "#" },
                                { label: "FC1C3 Item2", url: "#" },
                                { label: "FC1C3 Item3", url: "#" },
                                { label: "FC1C3 Item4", url: "#" },
                                { label: "FC1C3 Item5", url: "#" },
                                { label: "FC1C3 Item6", url: "#" },
                            ]
                        }
                    ]
                },
                {
                    featured: false, label: "Fireplace Category 2", url: "#", child: [
                        {
                            label: "FireplateCat2 Category1",
                            items: [
                                { label: "FC2C1 Item1", url: "#" },
                                { label: "FC2C1 Item2", url: "#" },
                                { label: "FC2C1 Item3", url: "#" },
                                { label: "FC2C1 Item4", url: "#" },
                                { label: "FC2C1 Item5", url: "#" },
                                { label: "FC2C1 Item6", url: "#" },
                            ]
                        },
                        {
                            label: "FireplateCat2 Category2",
                            items: [
                                { label: "FC2C2 Item1", url: "#" },
                                { label: "FC2C2 Item2", url: "#" },
                                { label: "FC2C2 Item3", url: "#" },
                                { label: "FC2C2 Item4", url: "#" },
                                { label: "FC2C2 Item5", url: "#" },
                                { label: "FC2C2 Item6", url: "#" },
                            ]
                        },
                        {
                            label: "FireplateCat2 Category3",
                            items: [
                                { label: "FC2C3 Item1", url: "#" },
                                { label: "FC2C3 Item2", url: "#" },
                                { label: "FC2C3 Item3", url: "#" },
                                { label: "FC2C3 Item4", url: "#" },
                                { label: "FC2C3 Item5", url: "#" },
                                { label: "FC2C3 Item6", url: "#" },
                            ]
                        }
                    ]
                }, ,
                {
                    featured: false, label: "Fireplace Category 3", url: "#", child: [
                        {
                            label: "FireplateCat3 Category1",
                            items: [
                                { label: "FC3C1 Item1", url: "#" },
                                { label: "FC3C1 Item2", url: "#" },
                                { label: "FC3C1 Item3", url: "#" },
                                { label: "FC3C1 Item4", url: "#" },
                                { label: "FC3C1 Item5", url: "#" },
                                { label: "FC3C1 Item6", url: "#" },
                            ]
                        },
                        {
                            label: "FireplateCat3 Category2",
                            items: [
                                { label: "FC3C2 Item1", url: "#" },
                                { label: "FC3C2 Item2", url: "#" },
                                { label: "FC3C2 Item3", url: "#" },
                                { label: "FC3C2 Item4", url: "#" },
                                { label: "FC3C2 Item5", url: "#" },
                                { label: "FC3C2 Item6", url: "#" },
                            ]
                        },
                        {
                            label: "FireplateCat3 Category3",
                            items: [
                                { label: "FC3C3 Item1", url: "#" },
                                { label: "FC3C3 Item2", url: "#" },
                                { label: "FC3C3 Item3", url: "#" },
                                { label: "FC3C3 Item4", url: "#" },
                                { label: "FC3C3 Item5", url: "#" },
                                { label: "FC3C3 Item6", url: "#" },
                            ]
                        }
                    ]
                },
            ],

        },
        {
            isActive: false,
            featured: false,
            label: "Promotion 1",
            icon: {
                name: "game-icons:hamburger-menu",
                position: "left",
            },
            expand_trigger: "hover", // click or hover
            child: [
                { featured: true, label: "Featured Category 1", url: "#" },
                { featured: true, label: "Featured Category 2", url: "#" },
                { featured: true, label: "Featured Category 3", url: "#" },
                {
                    featured: false, label: "Fireplace Category 1", url: "#", child: [
                        {
                            label: "FireplateCat1 Category1",
                            items: [
                                { label: "FC1C1 Item1", url: "#" },
                                { label: "FC1C1 Item2", url: "#" },
                                { label: "FC1C1 Item3", url: "#" },
                                { label: "FC1C1 Item4", url: "#" },
                                { label: "FC1C1 Item5", url: "#" },
                                { label: "FC1C1 Item6", url: "#" },
                            ]
                        },
                        {
                            label: "FireplateCat1 Category2",
                            items: [
                                { label: "FC1C2 Item1", url: "#" },
                                { label: "FC1C2 Item2", url: "#" },
                                { label: "FC1C2 Item3", url: "#" },
                                { label: "FC1C2 Item4", url: "#" },
                                { label: "FC1C2 Item5", url: "#" },
                                { label: "FC1C2 Item6", url: "#" },
                            ]
                        },
                        {
                            label: "FireplateCat1 Category3",
                            items: [
                                { label: "FC1C3 Item1", url: "#" },
                                { label: "FC1C3 Item2", url: "#" },
                                { label: "FC1C3 Item3", url: "#" },
                                { label: "FC1C3 Item4", url: "#" },
                                { label: "FC1C3 Item5", url: "#" },
                                { label: "FC1C3 Item6", url: "#" },
                            ]
                        }
                    ]
                },
                {
                    featured: false, label: "Fireplace Category 2", url: "#", child: [
                        {
                            label: "FireplateCat1 Category1",
                            items: [
                                { label: "FC2C1 Item1", url: "#" },
                                { label: "FC2C1 Item2", url: "#" },
                                { label: "FC2C1 Item3", url: "#" },
                                { label: "FC2C1 Item4", url: "#" },
                                { label: "FC2C1 Item5", url: "#" },
                                { label: "FC2C1 Item6", url: "#" },
                            ]
                        },
                        {
                            label: "FireplateCat1 Category2",
                            items: [
                                { label: "FC2C2 Item1", url: "#" },
                                { label: "FC2C2 Item2", url: "#" },
                                { label: "FC2C2 Item3", url: "#" },
                                { label: "FC2C2 Item4", url: "#" },
                                { label: "FC2C2 Item5", url: "#" },
                                { label: "FC2C2 Item6", url: "#" },
                            ]
                        },
                        {
                            label: "FireplateCat1 Category3",
                            items: [
                                { label: "FC2C3 Item1", url: "#" },
                                { label: "FC2C3 Item2", url: "#" },
                                { label: "FC2C3 Item3", url: "#" },
                                { label: "FC2C3 Item4", url: "#" },
                                { label: "FC2C3 Item5", url: "#" },
                                { label: "FC2C3 Item6", url: "#" },
                            ]
                        }
                    ]
                }, ,
                {
                    featured: false, label: "Fireplace Category 3", url: "#", child: [
                        {
                            label: "FireplateCat3 Category1",
                            items: [
                                { label: "FC3C1 Item1", url: "#" },
                                { label: "FC3C1 Item2", url: "#" },
                                { label: "FC3C1 Item3", url: "#" },
                                { label: "FC3C1 Item4", url: "#" },
                                { label: "FC3C1 Item5", url: "#" },
                                { label: "FC3C1 Item6", url: "#" },
                            ]
                        },
                        {
                            label: "FireplateCat1 Category2",
                            items: [
                                { label: "FC3C2 Item1", url: "#" },
                                { label: "FC3C2 Item2", url: "#" },
                                { label: "FC3C2 Item3", url: "#" },
                                { label: "FC3C2 Item4", url: "#" },
                                { label: "FC3C2 Item5", url: "#" },
                                { label: "FC3C2 Item6", url: "#" },
                            ]
                        },
                        {
                            label: "FireplateCat1 Category3",
                            items: [
                                { label: "FC3C3 Item1", url: "#" },
                                { label: "FC3C3 Item2", url: "#" },
                                { label: "FC3C3 Item3", url: "#" },
                                { label: "FC3C3 Item4", url: "#" },
                                { label: "FC3C3 Item5", url: "#" },
                                { label: "FC3C3 Item6", url: "#" },
                            ]
                        }
                    ]
                },
            ],

        }
    ] as any;

    const [selectedParent, setSelectedParent] = useState(null);
    const [selectedChild, setSelectedChild] = useState<any>("Fireplace Category 1");

    // const [selectedParentNav, setSelectedParentNav] = useState([])
    const handleParentClick = (label: any) => {
        setSelectedParent(prev => {
            if (prev === label) {
                return null;
            } else {
                return label;
            }
        })
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current?.contains(event.target as Node)) {
            setSelectedParent(null); // Close when clicking outside
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return <header className="sticky top-0 z-50 shadow-md bg-white">
        <nav className="container mx-auto bg-white">
            <div className="flex justify-between items-center pt-4 px-4">
                <a href="/" className="text-xl font-bold">Brand</a>
                <div className="text-xl font-bold min-w-[500px]">
                    <HomeSearch />
                </div>
                <ul className="flex space-x-4">
                    <li><a href="#home" className="text-gray-700 hover:text-blue-500 relative">
                        <div className="absolute bg-pallete-orange w-[20px] h-[20px] overflow-hidden rounded-full text-pallete-dark bottom-[60%] left-[60%] flex justify-center items-center">
                            <div className="text-[10px]">26</div>
                        </div>
                        <Icon icon="bx:cart" width="24" height="24" /></a></li>
                    <li><a href="#about" className="text-gray-700 hover:text-blue-500 relative">
                        
                    <div className="absolute bg-pallete-orange w-[20px] h-[20px] overflow-hidden rounded-full text-pallete-dark bottom-[60%] left-[60%] flex justify-center items-center">
                            <div className="text-[10px]">739</div>
                        </div>
                        <Icon icon="bx:heart" width="24" height="24" />
                    </a></li>
                </ul>
            </div>
            <div className="flex items-center justify-between mt-[20px]">
                <div className="flex">
                    {/* <div className="relative text-white bg-pallete-orange py-[5px] px-[15px] rounded-tl-md rounded-tr-md flex gap-[8px] items-center cursor-pointer">
                        <div><Icon icon="game-icons:hamburger-menu" /></div>
                        <div className="font-bold">All Categories</div>
                    </div>
                    <div className="text-white bg-white py-[5px] px-[15px] rounded-tl-md rounded-tr-md flex gap-[8px] items-center cursor-pointer">
                        <div><Icon icon="game-icons:hamburger-menu" /></div>
                        <div className="font-bold text-slate-800">Promotion 1</div>
                    </div>
                    <div className="text-white bg-white py-[5px] px-[15px] rounded-tl-md rounded-tr-md flex gap-[8px] items-center cursor-pointer">
                        <div><Icon icon="game-icons:hamburger-menu" /></div>
                        <div className="font-bold text-slate-800">Promotion 2</div>
                    </div>
                    <div className="text-white bg-white py-[5px] px-[15px] rounded-tl-md rounded-tr-md flex gap-[8px] items-center cursor-pointer">
                        <div><Icon icon="game-icons:hamburger-menu" /></div>
                        <div className="font-bold text-slate-800">Promotion 3</div>
                    </div>
                    <div className="text-white bg-white py-[5px] px-[15px] rounded-tl-md rounded-tr-md flex gap-[8px] items-center cursor-pointer">
                        <div><Icon icon="game-icons:hamburger-menu" /></div>
                        <div className="font-bold text-slate-800">Promotion 4</div>
                    </div> */}
                    {
                        menu.map((i: { featured: any; label: string | number | bigint | boolean | null | undefined; isActive: any; icon: { name: string }; }, index: any) =>
                            <div onClick={() => {
                                if (i.featured) {
                                    handleParentClick(i.label)
                                }
                            }} key={`parent-nav-${index}`} className={`relative py-[5px] px-[15px] rounded-tl-md rounded-tr-md flex gap-[8px] items-center cursor-pointer ${i.isActive ? 'text-white bg-pallete-orange' : 'bg-white text-pallete-dark'}`}>
                                <div className="text-white"><Icon icon={i.icon.name} /></div>
                                <div className="font-bold">{i.label}</div>
                            </div>
                        )
                    }
                </div>
                <div>
                    <div className="cursor-pointer font-semibold text-pallete-gray">
                        Free Shipping over $50
                    </div>
                </div>
            </div>
        </nav>


        {
            selectedParent && <nav ref={dropdownRef} className="relative container mx-auto">
                {
                    menu.filter((i: {label: string}) => i.label === selectedParent).length > 0 &&
                    <div className="px-[0px] pt-[20px] flex">
                        <div className="p-[0px] border-r">
                            <ul>
                                {
                                     menu.filter((i1: { label: any; }) => i1.label === selectedParent)[0]["child"].map((i1: { featured: any, label: string, url: string }, index: number) =>
                                        <li onClick={() => {
                                            if (!i1?.featured) {
                                                setSelectedChild(i1.label)
                                            }
                                        }} key={`sub-nav-${index}`} className={`py-[15px] ${menu.filter((i1: { label: string }) => i1.label === selectedParent)[0]["child"].length - 1 === index ? '' : 'border-b'} ${i1.label === selectedChild ? 'font-bold bg-gray-100' : ''}`}>
                                            <a href={i1?.featured ? i1?.url : '#'} className={`px-[15px] text-black text-[18px] flex items-center justify-between gap-[20px] ${i1?.featured ? 'font-semibold' : ''}`}>
                                                <div>
                                                    {i1?.label}
                                                </div>
                                                {
                                                    !i1?.featured && <Icon icon="solar:alt-arrow-right-line-duotone" className="text-pallete-gray" />
                                                }
                                            </a>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                        <div className="py-[15px] px-[20px] flex gap-[40px]">
                            {
                                menu.filter((i: { label: string }) => i.label === selectedParent)[0]["child"].filter((i1: { label: string }) => i1?.label === selectedChild)[0]?.child.map((i2: any, index: number) =>
                                    <div key={`cat-item-group-${index}`}>
                                        <div className="font-bold">{i2.label}</div>
                                        <div className="py-[10px]">
                                            <ul key={`cat-item-group-ul-${index}`}>
                                                {
                                                    i2.items.map((i: any, index2: number) =>
                                                        <li key={`sub-cat-${index}-item-${index2}`} className="py-[10px]">
                                                            <a href={i.url}>{i.label}</a>
                                                        </li>
                                                    )
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                }

                <div className="absolute right-0 top-[30%] bg-red-500 w-[150px] h-[150px] rounded-l-3xl overflow-hidden">
                    <img src="/images/nav/b0e0957222be79827a6625bcc5a5585d.png" alt="nav-extra-pic" className="object-contain" />
                </div>
            </nav>
        }
    </header>

}

export default HomeNav;