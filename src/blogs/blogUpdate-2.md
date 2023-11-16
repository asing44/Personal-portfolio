---
title: 'Changing project focus'
readTime: '10 min'
category: 'dmd 300'
published: Oct. 31, 2023
summary: 'In this DMD 300 update, I split my project into design and development. Embraced 11ty and AI. Planning for content and design refinement.'
articleThumbnail: assets/images/blogs/thumbnails/blog-2-thumbnail.png
articleThumbnailAlt: The site's sitemap
---

<section class="sectionWrapper">

## Introduction

The journey of a creative project is often a dynamic one, filled with surprises, shifts, and exciting opportunities for growth. This week, I find myself at a crossroads in my personal portfolio project, and I'm excited to share the latest developments with you.
I've decided to redefine the objectives of my project. While my original plan encompassed both design and development aspects, I've chosen to divide my approach. I'm focusing my creative energy on the design of the site, aiming to create a visually captivating digital space that truly represents me. On the other hand, the development phase is now concentrated on two key areas: the home page and the blog pages.

My overall objective has undergone a transformation as well. I've embraced the world of static site generators as a means to streamline and enhance the development process. Specifically, I've I have decided to use <a class="__inline-link --cursor-expand-outer" href="https://www.11ty.dev/" target="_blank"><span>11ty</span></a>, exploring the possibilities of <a class="__inline-link --cursor-expand-outer" href="https://mozilla.github.io/nunjucks/" target="_blank"><span>Nunjucks</span></a> templating, harnessing the power of <a class="__inline-link --cursor-expand-outer" href="https://www.markdownguide.org/" target="_blank"><span>Markdown</span></a> files, and experimenting with the versatility of JSON files. These tools and technologies are now integral to my project, paving the way for a more efficient and flexible development process.

I've begun utilizing AI for content writing and coding assistance ase well, allowing me to streamline the creation process and gain insights and suggestions that are both innovative and invaluable. It's a game-changer that promises to elevate the quality of my project and expand my creative horizons.


</section>
<section class="sectionWrapper">

## Progress Update

In the ever-evolving landscape of web development, adapting to new tools and technologies is paramount. My decision to pivot my project towards static site generation using 11ty has opened up exciting possibilities. Here's a glimpse of the steps I've taken to set up the static site and the resulting progress:

1.	**Installation and Configuration:** I kicked off the journey by installing 11ty and configuring it to suit the unique requirements of my portfolio. The installation process was smooth, and I was able to set up the basic folder structure in no time.

<figure class="articleFigure" name="articleFigure-1"><img class="articleImg-sm -img-shadow-rg" src="/assets/images/blogs/thumbnails/blog-2-thumbnail.png" alt="The site's sitemap">
<figcaption class="-sm-em" for="articleFigure-1">11ty file structure</figcaption>
</figure>

2.	**Nunjucks Templating:** One of the highlights of working with 11ty is the use of Nunjucks templating. This powerful template engine has made structuring my site a breeze. I've created reusable templates for various sections of the site, which has significantly streamlined the development process.

<figure class="articleFigure" name="articleFigure-2"><img class="articleImg-sm -img-shadow-rg" src="/assets/images/blogs/blog-2/Nunjucks template.png" alt="An example of a Nunjucks template">
<figcaption class="-sm-em" for="articleFigure-2">Nunjuck's 'base' template for the website</figcaption>
</figure>
 
3.	**Leveraging Markdown:** Incorporating Markdown files has allowed me to separate content from layout, making content management more flexible and efficient. Creating and editing content is now a straightforward task.

<figure class="articleFigure" name="articleFigure-3"><img class="articleImg-sm -img-shadow-rg" src="/assets/images/blogs/blog-2/Markdown.png" alt="The Markdown format for a blog article">
<figcaption class="-sm-em" for="articleFigure-3">The Markdown format for a blog article</figcaption>
</figure>
 
4.	**JSON Files for Data:** To ensure a dynamic touch to my static site, I've employed JSON files to store data. These files contain crucial information for elements such as project descriptions and metadata, which can be easily manipulated as my portfolio evolves.

<figure class="articleFigure" name="articleFigure-4"><img class="articleImg-sm -img-shadow-rg" src="/assets/images/blogs/blog-2/JSON.png" alt="JSON data for each blog article">
<figcaption class="-sm-em" for="articleFigure-4">JSON data for each blog article</figcaption>
</figure>

### Designing the Logo and Style Guide

Beyond the technical aspects, I've also delved into the creative side of the project. Crafting the aesthetics of my portfolio is just as crucial as its functionality. Here's an update on the design elements I've been working on:

1.	**Logo Design:** The visual identity of my portfolio is taking shape with the design of a unique and memorable logo. I wanted the logo to encapsulate my personality and style, and the creative process is well underway.

<!-- !! INSERT -->
<figure class="articleFigure" name="articleFigure-4"><img class="articleImg-sm -img-shadow-rg" src="/assets/images/blogs/blog-2/JSON.png" alt="JSON data for each blog article">
<figcaption class="-sm-em" for="articleFigure-4">JSON data for each blog article</figcaption>
</figure>
 
2.	**Base Style Guide:** A solid foundation is essential, and that's precisely what the base style guide provides. It includes color schemes, typography choices, and layout guidelines, ensuring consistency and cohesion throughout the site.

<!-- !! INSERT -->
<figure class="articleFigure" name="articleFigure-4"><img class="articleImg-sm -img-shadow-rg" src="/assets/images/blogs/blog-2/JSON.png" alt="JSON data for each blog article">
<figcaption class="-sm-em" for="articleFigure-4">JSON data for each blog article</figcaption>
</figure>
 
The process of developing the static site and crafting the design elements has been both a technical and artistic adventure. Stay tuned for further updates as I continue to fine-tune these aspects, bringing my portfolio project one step closer to its final form. Your support and feedback are invaluable as I navigate this creative journey!

## Challenges faced

Embarking on a project that incorporates new technologies and approaches is always an exciting adventure, but it comes with its fair share of challenges. In this section, I'll delve into the obstacles I encountered while working with 11ty, Nunjucks, and Markdown, as well as the complexities of migrating an old site into this new static site. Here's a look at the challenges I faced:

1.	**Learning Curve** - 11ty, Nunjucks, and Markdown:
Learning new tools and technologies is an integral part of growth in web development. However, diving into the world of 11ty, Nunjucks, and even Markdown presented a steeper learning curve than I initially anticipated.
    
    - 11ty's Flexibility: While 11ty is renowned for its flexibility, this characteristic can also be a double-edged sword. The freedom to structure the project as I saw fit meant I needed to establish a clear and efficient workflow, which took some time to perfect.
    - Nunjucks Templating: Though Nunjucks is a powerful templating engine, grasping its nuances and employing it effectively required a significant investment of time in understanding its syntax and logic.
    - Markdown Mastery: Working with Markdown was relatively new to me, and I found myself learning on the fly. While it's an incredibly user-friendly markup language, the fine details took some effort to master.

2.	**Site Migration Challenges:**
Migrating an existing site into a new static site structure brought its own set of complexities:
    -	Content Transformation: Converting the content from the old site into Markdown format was a meticulous task, especially given the variations in formatting between the old and new platforms.
    -	Layout and Design Transition: Adapting the old site's layout and design to the new templates created with Nunjucks proved to be a challenge in maintaining the consistency and aesthetics I desired.
    -	URL Handling: Handling URLs and redirects was another puzzle to solve, ensuring that the transition from the old site to the new one would be seamless for visitors and search engines.

Overcoming these hurdles allowed me to gain a deeper understanding of these technologies and improve my problem-solving skills. I can now appreciate the flexibility of 11ty, the power of Nunjucks, and the simplicity of Markdown even more. As for the site migration, it has enabled me to ensure a smoother and more user-friendly experience for visitors. The journey of this project has been both enlightening and rewarding, and I look forward to sharing the results of my efforts with you soon.

## Upcoming Plans

As any creative endeavor progresses, it's crucial to have a clear plan for the future. The journey of building my personal portfolio site is far from over, and I'm excited to share my upcoming plan to take this project to new heights.

1.	**Fine-Tuning the Site and Migration:**
The immediate focus remains on fine-tuning the site and perfecting the migration process from the old site. Here's what I have in mind:
    -	Content Refinement: I'll continue refining and optimizing the content, ensuring that it aligns seamlessly with the new Markdown format, providing a better reading experience for visitors.
    -	Layout and Design Tweaks: Design is an ever-evolving process, and I'll be making adjustments to ensure a consistent and visually engaging experience. This includes refining the existing design elements and incorporating new ones.
    -	URL Management: Maintaining a seamless transition from the old site to the new one is paramount. I'll be working on creating and implementing an effective URL structure and redirection system

2.	**Continuing to Design Site Elements:**
Crafting the aesthetics of the site is an ongoing effort. Here's what's in store:
    -	Logo Perfection: The design of the logo is in progress, and I'll be dedicating time to perfecting this crucial element. It's essential that the logo embodies the essence of my digital identity.
    -	Visual Elements: Beyond the logo, I'll be working on additional visual elements to enhance the overall look and feel of the site, making it more immersive and engaging.
    -	Consistency in Design: Maintaining a cohesive and unified design approach across all pages of the site is a priority. This consistency will contribute to a more polished and professional appearance.

3.	**Starting the Wireframing Process:**
Looking ahead, I'm excited to kickstart the wireframing process for the site. Wireframing is a fundamental step in web design, serving as a blueprint that outlines the structure and layout of each page. This process will involve:
    -	Layout Planning: Carefully planning the arrangement of elements on each page to maximize usability and aesthetics.
    -	User Experience Focus: Ensuring that the site is intuitive and user-friendly, providing visitors with a seamless and enjoyable browsing experience.
    -	Responsive Design: Designing with responsiveness in mind, so the site looks and functions well on a variety of devices and screen sizes.

In the coming week, I'll be diving headfirst into these tasks, and I'm excited to see the project evolve even further. Stay tuned for updates and insights on my progress as I continue crafting my digital identity!

## Conclusion

Throughout this project, I've faced challenges that pushed me to learn and adapt. Embracing new technologies like 11ty, Nunjucks, and Markdown was a rewarding experience, and it reinforced the idea that growth often emerges from stepping out of one's comfort zone. These tools have allowed me to create a site that is not only visually captivating but also highly manageable and adaptable, and I'm excited to see how they will continue to shape my project.

The migration of the old site brought its own set of complexities, but it was a worthwhile endeavor. It has allowed me to not only preserve the essence of my previous work but also present it in a more sophisticated and engaging manner.

I am planning to fine-tune the site, enhancing its content, design, and functionality. The design process continues, with a logo that's taking shape and a focus on visual elements. I am also starting the wireframing process for the site.

I'm excited to share the results of my efforts with you soon and to continue growing and learning in the world of web development and design.

</section>