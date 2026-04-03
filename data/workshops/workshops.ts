export const workshopsOffered = [
  {
    type: "Half Day Certificate Programs",
    listOfWorkshops: [
      {
        title: "Cognitive Behavioral Therapy",
        extras:
          "with special focus on Adolescents & Youth Dynamics and Psychopathology",
        date: "Jan 2026",
        link: "https://expressionsindia.org/images/training_workshops/certificate/2026/webinar_jan26.png",
      },
      {
        title: "Rorschach Inkblot Test",
        extras: "Psychometeric Orientation Workshop Series - 2026",
        date: "Feb 2026",
        link: "https://expressionsindia.org/images/training_workshops/certificate/2026/psychometric_feb26.png",
      },
      {
        title:
          "Promoting Child Protection, Legal Literacy & Mental Health Safety",
        extras: "One day program on recent advances and case reviews.",
        date: "Mar 2026",
        link: "https://expressionsindia.org/images/training_workshops/certificate/2026/launch_mar26.png",
      },
      {
        title: "Neuropsychological Assessment, Tools and Techniques",
        extras: "Four Days Intensive Workshop",
        date: "Apr 2026",
        link: "https://expressionsindia.org/images/training_workshops/certificate/2026/neuro_apr26.png",
      },
      {
        title: "POSCO Act, Child and Adolescent Wellbeing",
        extras:
          "Counselling Guidelines for Teachers, Counselors and Allied Stakeholders",
        date: "May 2026",
        link: "https://expressionsindia.org/images/training_workshops/certificate/2026/pocso_may26.png",
      },
      {
        title: "Pscho-Oncology",
        extras:
          "Webinar based orientation program on recent understanding and trends.",
        date: "May 2026",
        link: "https://expressionsindia.org/images/training_workshops/certificate/2026/psycho_oncology_may26.png",
      },
      {
        title: "Basic and Advanced Statistical Analysis",
        extras: "Perspectives in mental health and wellbeing.",
        date: "May 2026",
        link: "https://expressionsindia.org/images/training_workshops/certificate/2026/basic_may26.png",
      },
      {
        title: "Neuropsychological Assessment and it's Applications",
        extras: "Webinar based orientation program.",
        date: "Jun 2026",
        link: "https://expressionsindia.org/images/training_workshops/certificate/2026/neuro_jun26.png",
      },
      {
        title: "Celebrate Effective Choices. Enrich the careers in psychology",
        extras: "",
        date: "Jul 2026",
        link: "https://expressionsindia.org/images/training_workshops/certificate/2026/clinical_jul26.png",
      },
      {
        title: "Adolescent Mental Health and Wellbeing",
        extras: "Building effective trainers for adolescent wellbeing",
        date: "Aug 2026",
        link: "https://expressionsindia.org/images/training_workshops/certificate/2026/adolescent_aug26.png",
      },
    ],
  },
  {
    type: "National Summit and Conference",
    listOfWorkshops: [
      {
        title:
          "2nd National Conference on Contemporary School Mental Health Initiatives",
        extras: "Bridging the Gap with Innovative Best Practices ",
        date: "26 & 27 Feb 2026",
        link: "https://expressionsindia.org/images/training_workshops/summit/2026/summit_feb26.pdf",
      },
      {
        title: "International Adolescent Leadership Summit 2026",
        extras:
          "On Life Skills, Resilience, Positive Mental Health & Wellbeing",
        date: "Dec 2026",
        link: "https://expressionsindia.org/images/training_workshops/summit/2026/summit_feb26.pdf",
      },
    ],
  },
  {
    type: "Online and Offline Psychology Internship",
    listOfWorkshops: [
      {
        title:
          "Face to Face Comprehensive Internship in Clinical-Counseling Psychology & Allied Sciences (UG/PG) -",
        extras: "",
        date: "Jan to Jun 2026",
        link: "https://expressionsindia.org/images/training_workshops/psychology/2026/face_to_face.pdf",
      },
      {
        title:
          "Advanced Level of Online Internship Sessions for Psychology Students (XI & XII)",
        extras: "",
        date: "May to June 2026",
        link: "https://expressionsindia.org/images/training_workshops/psychology/2026/jun26.pdf",
      },
    ],
  },
  {
    type: "School Students Events and Competitions",
    listOfWorkshops: [
      {
        title: "Mindsmart – 2026",
        extras:
          "The Life Skills & Wellbeing Leadership Course for School Adolescent Peer Educators / Ambassadors",
        date: "Apr to Aug 2026",
        link: "https://expressionsindia.org/images/training_workshops/events/2026/mindsmart_2026.png",
      },
      {
        title: "Manasvita",
        extras: "The National Inter School Wellness Quiz",
        date: "Jul 2026",
        link: "https://expressionsindia.org/images/training_workshops/events/2026/manasvita_2026.png",
      },
      {
        title: "The 6th Life Empowerment Awards for Schools",
        extras: "",
        date: "Aug 2026",
        link: "https://expressionsindia.org/images/training_workshops/events/2026/6th_life_oct26.png",
      },
      {
        title: "National Psycholympiad",
        extras: "Exploring mystries of the brain, mind and behavior.",
        date: "Aug 2026",
        link: "https://expressionsindia.org/training_workshop.html#",
      },
      {
        title: "World Mental Health Week Celebrations -",
        extras: "",
        date: "Oct 2026",
        link: "",
      },
      {
        title: "International Young Film Makers Festival",
        extras: "",
        date: "Oct 2026",
        link: "",
      },
    ],
  },
  {
    type: "Webinar Based Orientation Course",
    listOfWorkshops: [
      {
        title:
          "Strengthening Resilience and Enriching Mental Health & Wellbeing",
        extras: "A Life Skills Based - Transformatory Leadership ",
        date: "Nov 2026",
        link: "",
      },
      {
        title: "Comprehensive Health Checkup Camps in Suburban & Rural Schools",
        extras: "",
        date: "2026",
        link: "",
      },
      {
        title:
          "Intervention Center for Early Childhood Care, Nutrition & Education",
        extras: "Recent Advances in Brain, Mind & Behavioral Linkages",
        date: "2026",
        link: "",
      },
    ],
  },
];
export type WorkshopsOffered = {
  type: string;
  listOfWorkshops: Workshop[];
};
export type Workshop = {
  title: string;
  extras?: string;
  date: string;
  link: string;
};
