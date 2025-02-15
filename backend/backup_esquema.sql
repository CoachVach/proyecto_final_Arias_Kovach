--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alumno; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alumno (
    id_estudiante integer NOT NULL,
    doc character varying(255) NOT NULL,
    nro_identidad character varying(255) NOT NULL,
    lu character varying(255),
    nombre_completo character varying(255) NOT NULL
);


ALTER TABLE public.alumno OWNER TO postgres;

--
-- Name: alumno_id_estudiante_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alumno_id_estudiante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alumno_id_estudiante_seq OWNER TO postgres;

--
-- Name: alumno_id_estudiante_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alumno_id_estudiante_seq OWNED BY public.alumno.id_estudiante;


--
-- Name: colaborador_mesa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.colaborador_mesa (
    id_colaborador_mesa integer NOT NULL,
    id_profesor integer NOT NULL,
    id_mesa integer NOT NULL
);


ALTER TABLE public.colaborador_mesa OWNER TO postgres;

--
-- Name: colaborador_mesa_id_colaborador_mesa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.colaborador_mesa_id_colaborador_mesa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.colaborador_mesa_id_colaborador_mesa_seq OWNER TO postgres;

--
-- Name: colaborador_mesa_id_colaborador_mesa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.colaborador_mesa_id_colaborador_mesa_seq OWNED BY public.colaborador_mesa.id_colaborador_mesa;


--
-- Name: mesa_alumno; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mesa_alumno (
    id_mesa_alumno integer NOT NULL,
    id_estudiante integer NOT NULL,
    id_mesa integer NOT NULL,
    carrera character varying(255),
    calidad character varying(255),
    codigo character varying(255),
    plan integer,
    presente boolean DEFAULT false NOT NULL,
    inscripto boolean DEFAULT true NOT NULL,
    nota character varying(255) DEFAULT '-'::character varying
);


ALTER TABLE public.mesa_alumno OWNER TO postgres;

--
-- Name: mesa_alumno_id_mesa_alumno_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mesa_alumno_id_mesa_alumno_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mesa_alumno_id_mesa_alumno_seq OWNER TO postgres;

--
-- Name: mesa_alumno_id_mesa_alumno_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mesa_alumno_id_mesa_alumno_seq OWNED BY public.mesa_alumno.id_mesa_alumno;


--
-- Name: mesa_examen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mesa_examen (
    id_mesa integer NOT NULL,
    fecha timestamp with time zone NOT NULL,
    materia character varying(255) NOT NULL,
    id_profesor integer NOT NULL
);


ALTER TABLE public.mesa_examen OWNER TO postgres;

--
-- Name: mesa_examen_id_mesa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mesa_examen_id_mesa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mesa_examen_id_mesa_seq OWNER TO postgres;

--
-- Name: mesa_examen_id_mesa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mesa_examen_id_mesa_seq OWNED BY public.mesa_examen.id_mesa;


--
-- Name: profesor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profesor (
    id_profesor integer NOT NULL,
    nombre character varying(255) NOT NULL,
    apellido character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.profesor OWNER TO postgres;

--
-- Name: profesor_id_profesor_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.profesor_id_profesor_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profesor_id_profesor_seq OWNER TO postgres;

--
-- Name: profesor_id_profesor_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.profesor_id_profesor_seq OWNED BY public.profesor.id_profesor;


--
-- Name: alumno id_estudiante; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno ALTER COLUMN id_estudiante SET DEFAULT nextval('public.alumno_id_estudiante_seq'::regclass);


--
-- Name: colaborador_mesa id_colaborador_mesa; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colaborador_mesa ALTER COLUMN id_colaborador_mesa SET DEFAULT nextval('public.colaborador_mesa_id_colaborador_mesa_seq'::regclass);


--
-- Name: mesa_alumno id_mesa_alumno; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa_alumno ALTER COLUMN id_mesa_alumno SET DEFAULT nextval('public.mesa_alumno_id_mesa_alumno_seq'::regclass);


--
-- Name: mesa_examen id_mesa; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa_examen ALTER COLUMN id_mesa SET DEFAULT nextval('public.mesa_examen_id_mesa_seq'::regclass);


--
-- Name: profesor id_profesor; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor ALTER COLUMN id_profesor SET DEFAULT nextval('public.profesor_id_profesor_seq'::regclass);


--
-- Name: alumno alumno_lu_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno
    ADD CONSTRAINT alumno_lu_key UNIQUE (lu);


--
-- Name: alumno alumno_nro_identidad_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno
    ADD CONSTRAINT alumno_nro_identidad_key UNIQUE (nro_identidad);


--
-- Name: alumno alumno_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno
    ADD CONSTRAINT alumno_pkey PRIMARY KEY (id_estudiante);


--
-- Name: colaborador_mesa colaborador_mesa_id_profesor_id_mesa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colaborador_mesa
    ADD CONSTRAINT colaborador_mesa_id_profesor_id_mesa_key UNIQUE (id_profesor, id_mesa);


--
-- Name: colaborador_mesa colaborador_mesa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colaborador_mesa
    ADD CONSTRAINT colaborador_mesa_pkey PRIMARY KEY (id_colaborador_mesa);


--
-- Name: mesa_alumno mesa_alumno_id_estudiante_id_mesa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa_alumno
    ADD CONSTRAINT mesa_alumno_id_estudiante_id_mesa_key UNIQUE (id_estudiante, id_mesa);


--
-- Name: mesa_alumno mesa_alumno_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa_alumno
    ADD CONSTRAINT mesa_alumno_pkey PRIMARY KEY (id_mesa_alumno);


--
-- Name: mesa_examen mesa_examen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa_examen
    ADD CONSTRAINT mesa_examen_pkey PRIMARY KEY (id_mesa);


--
-- Name: profesor profesor_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor
    ADD CONSTRAINT profesor_email_key UNIQUE (email);


--
-- Name: profesor profesor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profesor
    ADD CONSTRAINT profesor_pkey PRIMARY KEY (id_profesor);


--
-- Name: colaborador_mesa colaborador_mesa_id_mesa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colaborador_mesa
    ADD CONSTRAINT colaborador_mesa_id_mesa_fkey FOREIGN KEY (id_mesa) REFERENCES public.mesa_examen(id_mesa) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: colaborador_mesa colaborador_mesa_id_profesor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colaborador_mesa
    ADD CONSTRAINT colaborador_mesa_id_profesor_fkey FOREIGN KEY (id_profesor) REFERENCES public.profesor(id_profesor) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mesa_alumno mesa_alumno_id_estudiante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa_alumno
    ADD CONSTRAINT mesa_alumno_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES public.alumno(id_estudiante) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mesa_alumno mesa_alumno_id_mesa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa_alumno
    ADD CONSTRAINT mesa_alumno_id_mesa_fkey FOREIGN KEY (id_mesa) REFERENCES public.mesa_examen(id_mesa) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mesa_examen mesa_examen_id_profesor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa_examen
    ADD CONSTRAINT mesa_examen_id_profesor_fkey FOREIGN KEY (id_profesor) REFERENCES public.profesor(id_profesor) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

