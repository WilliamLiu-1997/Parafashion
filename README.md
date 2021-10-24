# Parafashion

A 3D web application that can help simplify the design and customising process of garments. Main functions include decomposing the 3D mesh into small patches according to user’s inputs and customizing the material and texture of each patch.

## Live Demo

https://parafashion.vercel.app/

https://parafashion.github.io/

## Description

Since clothing has entered assembled line production for decades, standard sized clothing has become the main choice of people. It is more convenient, time and money efficient as it does not require the measure process as the traditional customised clothing does. However, it may also cause massive waste due to the misfit problem. Customised clothing, on the other hand, does not have this problem, however, it takes complex measuring process by a tailor and is not efficient.

This project aims at solving the problems above through developing a 3D web application that can simplify the design and measurement process of customised garment. Given a 3D human body mesh, the application can be able to automatically decompose it into several patches or decompose it according to user’s input. The decomposed patches should as little mechanical stress as possible. In addition, the stress will be illustrated in the application so tailors can directly cut the fabric. Moreover, user can be also able to customise the texture and pattern of each patch. The underline theories including basic patch decomposition and geometry processing are taken from the paper ***“Reliable Feature-Line Driven Quad-Remeshing”*** by NICO PIETRONI et al. (Siggraph, 2021). Overall ,this application is able to let users customise their own clothes according to their bodily form and tailors can directly produce the clothes according to the information of the patches decomposed from the 3D body mesh provided.
