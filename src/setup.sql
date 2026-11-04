-- ========================================
-- Organization Table
-- ========================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- ========================================
-- Insert sample data: Organizations
-- ========================================

INSERT INTO organization (
    name,
    description,
    contact_email,
    logo_filename
)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);

-- ========================================
-- Service Project Table
-- ========================================

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    project_date DATE NOT NULL,

    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization (organization_id)
        ON DELETE RESTRICT
);

SELECT organization_id, name
FROM organization
ORDER BY organization_id;

-- ========================================
-- Insert Service Projects
-- ========================================

WITH project_data (
    organization_name,
    title,
    description,
    location,
    project_date
) AS (
    VALUES

    -- BrightFuture Builders

    (
        'BrightFuture Builders',
        'Community School Renovation',
        'Renovation of classrooms and improvement of school facilities for children in underserved communities.',
        'Teshie, Accra',
        '2026-11-10'::DATE
    ),
    (
        'BrightFuture Builders',
        'Digital Skills Training',
        'Providing basic computer literacy and digital skills training to young people.',
        'Nungua, Accra',
        '2026-11-15'::DATE
    ),
    (
        'BrightFuture Builders',
        'Youth Mentorship Programme',
        'Connecting young people with experienced professionals for career guidance and mentorship.',
        'Tema, Greater Accra',
        '2026-11-20'::DATE
    ),
    (
        'BrightFuture Builders',
        'Community Library Project',
        'Establishing a community library to improve access to books and educational resources.',
        'Madina, Accra',
        '2026-11-25'::DATE
    ),
    (
        'BrightFuture Builders',
        'School Supplies Donation',
        'Distributing learning materials and school supplies to children from low-income households.',
        'Ashaiman, Greater Accra',
        '2026-12-01'::DATE
    ),

    -- GreenHarvest Growers

    (
        'GreenHarvest Growers',
        'Community Vegetable Farming',
        'Supporting local communities to establish vegetable gardens for food security.',
        'Dodowa, Greater Accra',
        '2026-11-12'::DATE
    ),
    (
        'GreenHarvest Growers',
        'Sustainable Agriculture Training',
        'Training farmers in sustainable farming techniques and environmentally friendly agricultural practices.',
        'Aburi, Eastern Region',
        '2026-11-17'::DATE
    ),
    (
        'GreenHarvest Growers',
        'Tree Planting Initiative',
        'Organizing community tree planting activities to promote environmental conservation.',
        'Koforidua, Eastern Region',
        '2026-11-22'::DATE
    ),
    (
        'GreenHarvest Growers',
        'Clean Water for Farmers',
        'Improving access to clean water for farming communities through water infrastructure support.',
        'Nsawam, Eastern Region',
        '2026-11-27'::DATE
    ),
    (
        'GreenHarvest Growers',
        'Farmers Market Development',
        'Helping local farmers connect with consumers through organized community markets.',
        'Kasoa, Central Region',
        '2026-12-03'::DATE
    ),

    -- UnityServe Volunteers

    (
        'UnityServe Volunteers',
        'Community Health Outreach',
        'Organizing health education and basic medical screening activities for underserved communities.',
        'Teshie, Accra',
        '2026-11-14'::DATE
    ),
    (
        'UnityServe Volunteers',
        'Beach Clean-Up Exercise',
        'Mobilizing volunteers to remove plastic waste and improve coastal environmental conditions.',
        'Labadi, Accra',
        '2026-11-19'::DATE
    ),
    (
        'UnityServe Volunteers',
        'Elderly Care Programme',
        'Providing companionship and essential support to elderly people in the community.',
        'Osu, Accra',
        '2026-11-24'::DATE
    ),
    (
        'UnityServe Volunteers',
        'Food Donation Campaign',
        'Collecting and distributing food supplies to vulnerable families.',
        'Kaneshie, Accra',
        '2026-11-29'::DATE
    ),
    (
        'UnityServe Volunteers',
        'Community Sanitation Project',
        'Organizing community clean-up activities to promote proper sanitation and waste management.',
        'Dansoman, Accra',
        '2026-12-04'::DATE
    )
)

INSERT INTO project (
    organization_id,
    title,
    description,
    location,
    project_date
)
SELECT
    o.organization_id,
    pd.title,
    pd.description,
    pd.location,
    pd.project_date
FROM project_data pd
JOIN organization o
    ON o.name = pd.organization_name;

SELECT
    p.project_id,
    p.title,
    o.name AS organization_name,
    p.location,
    p.project_date
FROM project p
JOIN organization o
    ON p.organization_id = o.organization_id
ORDER BY o.organization_id, p.project_id;

-- ========================================
-- Category Table
-- ========================================

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL
);

-- ========================================
-- Insert Service Project Categories
-- ========================================

INSERT INTO category (name, description)
VALUES
(
    'Environmental',
    'Projects focused on protecting the environment and promoting sustainability.'
),
(
    'Educational',
    'Projects that support learning, literacy, and educational opportunities.'
),
(
    'Community Service',
    'Activities that strengthen communities and support local needs.'
),
(
    'Health and Wellness',
    'Initiatives that promote healthy living and community well-being.'
);


-- ========================================
-- Project Category Junction Table
-- ========================================

CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project_category_project
        FOREIGN KEY (project_id)
        REFERENCES project (project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_project_category_category
        FOREIGN KEY (category_id)
        REFERENCES category (category_id)
        ON DELETE CASCADE
);

-- ========================================
-- Assign Categories to Service Projects
-- ========================================

WITH assignments (project_title, organization_name, category_name) AS (
    VALUES
    ('Community School Renovation', 'BrightFuture Builders', 'Educational'),
    ('Community School Renovation', 'BrightFuture Builders', 'Community Service'),

    ('Digital Skills Training', 'BrightFuture Builders', 'Educational'),

    ('Youth Mentorship Programme', 'BrightFuture Builders', 'Educational'),
    ('Youth Mentorship Programme', 'BrightFuture Builders', 'Community Service'),

    ('Community Library Project', 'BrightFuture Builders', 'Educational'),

    ('School Supplies Donation', 'BrightFuture Builders', 'Educational'),
    ('School Supplies Donation', 'BrightFuture Builders', 'Community Service'),

    ('Community Vegetable Farming', 'GreenHarvest Growers', 'Environmental'),
    ('Community Vegetable Farming', 'GreenHarvest Growers', 'Community Service'),

    ('Sustainable Agriculture Training', 'GreenHarvest Growers', 'Environmental'),
    ('Sustainable Agriculture Training', 'GreenHarvest Growers', 'Educational'),

    ('Tree Planting Initiative', 'GreenHarvest Growers', 'Environmental'),
    ('Tree Planting Initiative', 'GreenHarvest Growers', 'Community Service'),

    ('Clean Water for Farmers', 'GreenHarvest Growers', 'Environmental'),
    ('Clean Water for Farmers', 'GreenHarvest Growers', 'Community Service'),

    ('Farmers Market Development', 'GreenHarvest Growers', 'Community Service'),

    ('Community Health Outreach', 'UnityServe Volunteers', 'Health and Wellness'),
    ('Community Health Outreach', 'UnityServe Volunteers', 'Community Service'),

    ('Beach Clean-Up Exercise', 'UnityServe Volunteers', 'Environmental'),
    ('Beach Clean-Up Exercise', 'UnityServe Volunteers', 'Community Service'),

    ('Elderly Care Programme', 'UnityServe Volunteers', 'Health and Wellness'),
    ('Elderly Care Programme', 'UnityServe Volunteers', 'Community Service'),

    ('Food Donation Campaign', 'UnityServe Volunteers', 'Community Service'),
    ('Food Donation Campaign', 'UnityServe Volunteers', 'Health and Wellness'),

    ('Community Sanitation Project', 'UnityServe Volunteers', 'Environmental'),
    ('Community Sanitation Project', 'UnityServe Volunteers', 'Community Service')
)

INSERT INTO project_category (project_id, category_id)
SELECT
    p.project_id,
    c.category_id
FROM assignments a
JOIN project p
    ON p.title = a.project_title
JOIN organization o
    ON o.organization_id = p.organization_id
    AND o.name = a.organization_name
JOIN category c
    ON c.name = a.category_name
ON CONFLICT (project_id, category_id) DO NOTHING;


SELECT
    p.project_id,
    p.title,
    o.name AS organization_name,
    c.name AS category_name
FROM project_category pc
JOIN project p
    ON pc.project_id = p.project_id
JOIN organization o
    ON p.organization_id = o.organization_id
JOIN category c
    ON pc.category_id = c.category_id
ORDER BY p.project_id, c.category_id;



SELECT
    p.project_id,
    p.title,
    COUNT(pc.category_id) AS total_categories
FROM project p
LEFT JOIN project_category pc
    ON p.project_id = pc.project_id
GROUP BY p.project_id, p.title
ORDER BY p.project_id;



SELECT category_id, name, description
FROM category
ORDER BY category_id;
