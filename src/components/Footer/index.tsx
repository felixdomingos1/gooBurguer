import Link from "next/link";
import Image from "next/image";
import { FiFacebook, FiInstagram } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className=" bg-zinc-900 text-white mt-16">
            <div className=" max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <Link href="/" className="flex items-center space-x-2 mb-4">
                        <Image src="/images/6.png" alt="GooBurger Logo" width={40} height={40} />
                        <div>
                            <span className="text-2xl font-bold text-amber-500">Goo</span>
                            <span className="text-2xl font-bold text-green-500">Burger</span>
                        </div>
                    </Link>
                    <p className="text-sm text-zinc-400">
                        Hambúrgueres artesanais, preparados com ingredientes frescos e entregues na sua porta.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold text-lg mb-3">Links Rápidos</h4>
                    <ul className="space-y-2 text-sm text-zinc-400">
                        <li><Link href="/">Início</Link></li>
                        <li><Link href="/menu">Cardápio</Link></li>
                        <li><Link href="/sobre">Sobre Nós</Link></li>
                        <li><Link href="/contato">Contato</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-lg mb-3">Horário</h4>
                    <ul className="text-sm text-zinc-400 space-y-1">
                        <li>Seg - Sex: 8h - 22h</li>
                        <li>Sábado: 8h - 20h</li>
                        <li>Domingo: 8h - 12h</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-lg mb-3">Siga-nos</h4>
                    <div className="flex space-x-4 text-zinc-400 text-xl">
                        <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FiInstagram className="text-lg" />
                        </Link>
                        <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FiFacebook className="text-lg" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="border-t border-zinc-700 mt-8 py-4 text-center text-sm text-zinc-500">
                © {new Date().getFullYear()} GooBurger. Todos os direitos reservados.
            </div>
        </footer>
    );
}
