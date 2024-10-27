--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

-- Started on 2024-10-27 15:51:02

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
-- TOC entry 221 (class 1259 OID 16467)
-- Name: bolest_simptom; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bolest_simptom (
    bolest_id integer NOT NULL,
    simptom_id integer NOT NULL
);


ALTER TABLE public.bolest_simptom OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16452)
-- Name: bolesti; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bolesti (
    bolest_id integer NOT NULL,
    naziv_bolesti character varying(500),
    tipicna_starost_dijagnoze character varying(500),
    genetska_predispozicija character varying(500),
    razina_opasnosti character varying(500),
    faktori_rizika text,
    uobicajeni_lijekovi text,
    brzina_progresije_bolesti character varying(500),
    dijagnosticki_testovi text,
    tip_tretmana character varying(500)
);


ALTER TABLE public.bolesti OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16451)
-- Name: bolesti_bolest_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bolesti_bolest_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bolesti_bolest_id_seq OWNER TO postgres;

--
-- TOC entry 4815 (class 0 OID 0)
-- Dependencies: 217
-- Name: bolesti_bolest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bolesti_bolest_id_seq OWNED BY public.bolesti.bolest_id;


--
-- TOC entry 220 (class 1259 OID 16461)
-- Name: simptomi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.simptomi (
    simptom_id integer NOT NULL,
    simptom character varying(500)
);


ALTER TABLE public.simptomi OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16460)
-- Name: simptomi_simptom_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.simptomi_simptom_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.simptomi_simptom_id_seq OWNER TO postgres;

--
-- TOC entry 4816 (class 0 OID 0)
-- Dependencies: 219
-- Name: simptomi_simptom_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.simptomi_simptom_id_seq OWNED BY public.simptomi.simptom_id;


--
-- TOC entry 4650 (class 2604 OID 16455)
-- Name: bolesti bolest_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bolesti ALTER COLUMN bolest_id SET DEFAULT nextval('public.bolesti_bolest_id_seq'::regclass);


--
-- TOC entry 4651 (class 2604 OID 16464)
-- Name: simptomi simptom_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simptomi ALTER COLUMN simptom_id SET DEFAULT nextval('public.simptomi_simptom_id_seq'::regclass);


--
-- TOC entry 4809 (class 0 OID 16467)
-- Dependencies: 221
-- Data for Name: bolest_simptom; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bolest_simptom (bolest_id, simptom_id) FROM stdin;
1	1
1	2
1	3
2	4
2	5
2	6
3	6
3	7
3	8
4	6
4	7
5	9
5	10
6	11
6	12
7	13
8	14
8	15
9	6
9	16
10	14
10	15
\.


--
-- TOC entry 4806 (class 0 OID 16452)
-- Dependencies: 218
-- Data for Name: bolesti; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bolesti (bolest_id, naziv_bolesti, tipicna_starost_dijagnoze, genetska_predispozicija, razina_opasnosti, faktori_rizika, uobicajeni_lijekovi, brzina_progresije_bolesti, dijagnosticki_testovi, tip_tretmana) FROM stdin;
1	Dijabetes	Srednje odrasle do starije osobe	Umjerena do visoka	Blaga do teška	Pretilost, Sjedeći način života, Prehrana bogata šećerom	Inzulin, Metformin	Postupna, može se ubrzati ako se ne liječi	Razina šećera u krvi, HbA1c	Lijekovi, promjene u načinu života
2	Hipertenzija	Odrasli, obično preko 40	Umjerena	Blaga do teška	Visok unos soli, Pretilost, Stres	ACE inhibitori, Beta-blokatori	Postupna, može postati teška bez upravljanja	Mjerenja krvnog tlaka	Lijekovi, promjene u načinu života
3	Astma	Djetinjstvo, ali može se javiti u bilo kojoj dobi	Visoka	Blaga do teška	Alergije, Izloženost pušenju, Zagađenje	Inhalacijski kortikosteroidi, Bronhodilatatori	Varira; stabilno uz dobru kontrolu, epizodni izbijanja	Spirometrija, Mjerenje maksimalnog protoka	Lijekovi, izbjegavanje okidača
4	Kronična opstruktivna plućna bolest	Starije osobe, često preko 60	Niska, uglavnom zbog okolišnih faktora	Često teška i progresivna	Pušenje, Izloženost prašini i kemikalijama	Bronhodilatatori, Steroidi	Postupna, ali progresivna ako se ne liječi	Testovi plućne funkcije, Rentgen prsnog koša	Lijekovi, terapija kisikom
5	Alzheimerova bolest	Obično preko 65	Visoka za određene genske varijante	Progresivna, postaje teška	Starost, Genetski faktori, Faktori načina života	Donepezil, Memantin	Stabilno, ubrzava s vremenom	Kognitivne procjene, MRI skeniranje	Lijekovi, kognitivna terapija
6	Osteoporoza	Starije osobe, često postmenopauzalne	Umjerena do visoka	Blaga do teška, ovisno o gustoći kostiju	Bolovi u kostima, Frakture	Bifosfonati, Suplementi kalcija	Postupna, povećava se s godinama	Skeniranje gustoće kostiju (DEXA)	Lijekovi, promjene u prehrani
7	Reumatoidni artritis	Često odrasli od 30-50 godina	Visoka, posebno s određenim genetskim markerima	Blaga do teška	Pušenje, Obiteljska povijest, Spol	Metotreksat, NSAID	Postupna, može dovesti do oštećenja zglobova ako se ne liječi	Test za reumatoidni faktor, Rentgen zglobova	Lijekovi, fizioterapija
8	Parkinsonova bolest	Obično preko 60	Umjerena, pod utjecajem genetskih i okolišnih faktora	Progresivna, postaje teška	Starost, Izloženost toksinima	Levodopa, Agonisti dopamina	Stabilno, često se ubrzava s vremenom	Neurologijski pregled, MRI	Lijekovi, fizioterapija
9	Koronarna arterijska bolest	Srednje do starije osobe	Umjerena do visoka	Blaga do teška	Visok kolesterol, Pušenje, Hipertenzija	Statini, Beta-blokatori	Postupna, povećava se s vremenom i lošim upravljanjem	EKG, Koronarna angiografija	Lijekovi, promjene u načinu života
10	Hepatitis C	Često odrasli	Niska, prvenstveno stečena izloženosti	Blaga do teška	IV droga, Transfuzije krvi	Izravno djelujući antivirusni lijekovi (DAA)	Varira, može postati kronična ako se ne liječi	Viralni teret, Testovi funkcije jetre	Lijekovi
\.


--
-- TOC entry 4808 (class 0 OID 16461)
-- Dependencies: 220
-- Data for Name: simptomi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.simptomi (simptom_id, simptom) FROM stdin;
1	Pojačana žeđ
2	Često mokrenje
3	Umor
4	Često asimptomatski
5	Glavobolje
6	Kratkoća daha
7	Kronični kašalj
8	Zviždanje pri disanju
9	Osjećaj stezanja u prsima
10	Gubitak pamćenja
11	Zbunjenost
12	Bolovi u zglobovima
13	Tremor
14	Bolovi u trbuhu
15	Ikterus
16	Bolovi u kostima
17	Frakture
\.


--
-- TOC entry 4817 (class 0 OID 0)
-- Dependencies: 217
-- Name: bolesti_bolest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bolesti_bolest_id_seq', 10, true);


--
-- TOC entry 4818 (class 0 OID 0)
-- Dependencies: 219
-- Name: simptomi_simptom_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.simptomi_simptom_id_seq', 17, true);


--
-- TOC entry 4657 (class 2606 OID 16471)
-- Name: bolest_simptom bolest_simptom_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bolest_simptom
    ADD CONSTRAINT bolest_simptom_pkey PRIMARY KEY (bolest_id, simptom_id);


--
-- TOC entry 4653 (class 2606 OID 16459)
-- Name: bolesti bolesti_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bolesti
    ADD CONSTRAINT bolesti_pkey PRIMARY KEY (bolest_id);


--
-- TOC entry 4655 (class 2606 OID 16466)
-- Name: simptomi simptomi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simptomi
    ADD CONSTRAINT simptomi_pkey PRIMARY KEY (simptom_id);


--
-- TOC entry 4658 (class 2606 OID 16472)
-- Name: bolest_simptom bolest_simptom_bolest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bolest_simptom
    ADD CONSTRAINT bolest_simptom_bolest_id_fkey FOREIGN KEY (bolest_id) REFERENCES public.bolesti(bolest_id);


--
-- TOC entry 4659 (class 2606 OID 16477)
-- Name: bolest_simptom bolest_simptom_simptom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bolest_simptom
    ADD CONSTRAINT bolest_simptom_simptom_id_fkey FOREIGN KEY (simptom_id) REFERENCES public.simptomi(simptom_id);


-- Completed on 2024-10-27 15:51:02

--
-- PostgreSQL database dump complete
--

