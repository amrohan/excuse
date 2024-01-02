import type { FC } from "hono/jsx";
import { format } from "date-fns";
import { Excuse } from "../src";

const bodyStyle = {
  fontFamily: "'Inter', sans-serif",
};

export const Layout: FC = (props) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Our Excuses | amrohan</title>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        {/* Tailwind css */}
        <script src="https://cdn.tailwindcss.com"></script>

        {/* Google fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" Crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body style={bodyStyle}>
        <main class="p-2">{props.children}</main>
      </body>
    </html>
  );
};

export const Form: FC = () => {
  return (
    <div class="max-w-5xl mx-auto h-fit p-2">
      <h1 class="text-2xl font-bold">Excuses list</h1>
      <form
        class="flex justify-start items-center h-full gap-1 mt-2"
        hx-trigger="submit"
        hx-post="/api/excuse"
        hx-swap="afterbegin"
        hx-target="#excuse"
        hx-ext="reset"
        _="on htmx:afterRequest reset() me"
        hx-vals='{"title": this.title.value,"createdAt":this.createdAt.value}'
      >
        <div class="w-full h-full">
          <div class="relative w-full h-10">
            <input
              class="peer w-full h-full bg-transparent text-blue-gray-700  font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200  border focus:border-2 border-t-0 focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-gray-300 focus:border-gray-900"
              placeholder=" "
              name="title"
            />
            <label class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">
              Excuse
            </label>
          </div>
        </div>
        <div class="w-fit h-full grid place-content-center">
          <input
            type="date"
            name="createdAt"
            class="bg-transparent mr-2 focus:outline-none fill-current w-5"
          />
          {/* Calender */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            class="fill-current size-6 absolute -z-10"
          >
            <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
          </svg>
        </div>
        {/* Add icon */}
        <div class="w-10 h-full">
          <button
            class="relative grid place-content-center h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg bg-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="submit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              class="fill-current size-5 "
            >
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export const Item = ({
  title,
  id,
  CreatedAt,
}: {
  title: string;
  id: number | unknown;
  CreatedAt: string;
}) => (
  <div id={`item${id}`} class="h-fit w-full">
    <div class="flex items-center justify-between py-1 px-4 my-1 h-fit border-0 border-b border-zinc-300 z-10 text-black">
      <div
        class="flex flex-col justify-center item-center h-full w-11/12 "
        hx-target={`#item${id}`}
        hx-get={`/api/excuse/${id}`}
        hx-swap="outerHTML"
      >
        <p class="text-sm break-words">{title}</p>
        <p class="text-xs text-zinc-600">{format(CreatedAt, "MMM d, yyyy")}</p>
      </div>
      <div class="flex items-center justify-end w-1/12 z-20">
        {/* Delete Icon */}
        <button
          type="button"
          hx-target={`#item${id}`}
          hx-delete={`/api/excuse/${id}`}
          hx-swap="outerHTML"
          hx-confirm="Are you sure you wish to delete this?"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            class="fill-current size-5"
          >
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

export const UpdateItem = ({ excuse }: { excuse: Excuse }) => {
  return (
    <div id={`edit${excuse.excuseID}`} class="h-fit w-full">
      <div class="max-w-5xl mx-auto h-fit p-2">
        <form
          class="flex flex-col h-full gap-1 mt-2 w-full"
          hx-trigger="submit"
          hx-put="/api/excuse"
          hx-target={`#edit${excuse.excuseID}`}
          hx-ext="reset"
          _="on htmx:afterRequest reset() me"
          hx-vals='{"excuseID": this.excuseID.value, "title": this.title.value,"createdAt":this.createdAt.value}'
        >
          <div class="flex justify-between items-center gap-1 w-full">
            <div class="w-full h-full">
              <input type="hidden" name="excuseID" value={excuse.excuseID} />
              <div class="relative w-full h-10">
                <input
                  class="peer w-full h-full bg-transparent text-blue-gray-700  font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200  border focus:border-2 border-t-0 focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-300 focus:border-gray-900"
                  placeholder=" "
                  name="title"
                  value={excuse.title}
                />
                <label class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">
                  Excuse
                </label>
              </div>
            </div>
            <div class="w-fit h-full grid place-content-center">
              <input
                type="date"
                value={format(excuse.createdAt, "yyyy-MM-dd")}
                name="createdAt"
                class="bg-transparent mr-2 focus:outline-none fill-current w-5"
              />
              {/* Calender  */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
                class="fill-current size-6 absolute -z-10"
              >
                <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
              </svg>
            </div>
          </div>

          <div class="w-full h-fit flex justify-end items-center gap-2 mt-1">
            <button
              class="select-none rounded-lg bg-gray-900 py-2 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="submit"
            >
              Update
            </button>
            <button
              type="button"
              class="select-none rounded-lg border border-gray-900 py-2 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              hx-target={`#edit${excuse.excuseID}`}
              hx-get={`/api/excuse/cancel/${excuse.excuseID}`}
              hx-swap="outerHTML"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Alert = ({ msg, id }: { msg: string; id: number }) => (
  <section id={`alert${id}`} class="mb-2">
    <div
      role="alert"
      class="relative flex justify-between items-center w-full px-4 py-4 text-base text-white bg-gray-900 rounded-lg  animate-fade-down"
    >
      <div class="mr-12 text-xs">{msg}</div>
      <button
        hx-delete="/api/excuse/dismis"
        hx-target={`#alert${id}`}
        class="h-8 w-8 grid place-content-center  rounded-lg font-sans text-xs font-medium uppercase text-white transition-all hover:bg-white/10 active:bg-white/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-6 h-6"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  </section>
);
