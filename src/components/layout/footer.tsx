import React from "react";
import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  GithubIcon,
  HeartIcon,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container-custom mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">coli</h4>
            <p className="text-sm text-muted-foreground">
              Сервис для поиска жилья и соседей - найдите идеальный вариант
              проживания.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FacebookIcon size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <InstagramIcon size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <TwitterIcon size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <GithubIcon size={20} />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Навигация</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Главная
                </Link>
              </li>
              <li>
                <Link
                  href="/apartments"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Объявления
                </Link>
              </li>
              <li>
                <Link
                  href="/profile/add/announcements"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Разместить объявление
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Помощь</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Часто задаваемые вопросы
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Поддержка
                </Link>
              </li>
              <li>
                <Link
                  href="/guide"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Руководство пользователя
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Контакты</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                Адрес: г. Москва, ул. Примерная, 123
              </li>
              <li className="text-muted-foreground">
                Телефон: +7 (123) 456-78-90
              </li>
              <li className="text-muted-foreground">Email: info@coli.app</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} coli. Все права защищены.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6 text-sm">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Политика конфиденциальности
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Условия использования
            </Link>
            <Link
              href="/cookies"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Политика cookie
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center">
            Сделано с
            <HeartIcon size={14} className="mx-1 text-destructive" />
            для нашего сообщества
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
