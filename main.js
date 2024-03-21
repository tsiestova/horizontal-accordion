/*Code Block*/
/*<div
    data-section-custom-accordion
    data-blog-href="/custom-accordion"
>
</div>*/

/*Fetch from BLOG*/


(function (dataAttr){
    const utils = (function () {
        function getParentEl(el, tagName) {
            let searchEl = el;

            while (searchEl.parentElement) {
                if (searchEl.parentElement.tagName.toLowerCase() === tagName.toLowerCase()) {
                    return searchEl.parentElement;
                }

                searchEl = searchEl.parentElement;
            }

            return null;
        }

        function setAttrParents(attr, tag) {
            let list = document.querySelectorAll(`[${attr}]`);
            list.forEach((el) => {
                const tagEl = getParentEl(el, tag);

                if (!tagEl) {
                    return;
                }
                tagEl.setAttribute(attr, '');
            })
        }

        function fetchData(path) {
            const url = document.location.origin + path + '?format=json-pretty';

            return fetch(url)
                .then((response) => response.json())
        }

        return {
            setAttrParents, fetchData
        };
    })();

    utils.setAttrParents(dataAttr, 'section');

    const plugin = document.querySelector('div[data-section-custom-accordion]');

    const injectHtmlCode = (html) => {
        const div = document.createElement('div');
        div.classList.add('custom-accrodion-wrapper')
        div.innerHTML = html;
        plugin.appendChild(div);
    }

    const buildHtml = (items) => {
        const result = [];
        const paginationArr = [];
        for (let i = 0; i < items.length; i++) {

            const itemTitle = items[i].title;
            const itemExcerpt = items[i].excerpt;
            const iItemImage = items[i].assetUrl;
            const body = items[i].body;
            paginationArr.push(`<span class="pagination-item"></span>`);

            const createItem = `
   <div class="custom-accordion-item">
		<div class="custom-accordion-inner">
	<figure>
			    <img src="${iItemImage}" alt="">
			</figure>
    <div class="custom-accordion-header"></div>
    <div class="custom-accordion-body"></div>
    </div>
    <div class="custom-accordion-content">
        <div class="heading">${itemTitle}</div>
        <div class="img-title">${itemExcerpt}</div>
    </div>
</div>
`;
            result.push(createItem);
        }

        let htmlList = `<div class="custom-accrodion-list">${result.join('')}</div>`
        let htmlPagination = `<div class="pagination-list">${paginationArr.join('')}</div>`;


        injectHtmlCode(htmlList + htmlPagination);
    }


    const createContent = () => {
        const contentListUrl = plugin.getAttribute('data-blog-href')

        utils.fetchData(contentListUrl)
            .then((dataList) => {
                buildHtml(dataList.items);

                setStartPosition();
                animateImages();
                setEventHadler();
            });
    }

    createContent();

    const setStartPosition = () => {
        const accordionItems = document.querySelectorAll('.custom-accordion-item');
        const paginationList = document.querySelectorAll('.pagination-item');

        accordionItems[0].setAttribute('data-active', '');
        paginationList[0].setAttribute('data-active', '');

        setImgOffset(accordionItems, accordionItems[0]);
    }

    const animateImages = () => {
        const accordionItems = document.querySelectorAll('.custom-accordion-item');
        const paginationList = document.querySelectorAll('.pagination-item');

        accordionItems.forEach((el, i) => {
            el.addEventListener('pointerdown', () => {
                removeActive(accordionItems);
                removeActivePagination(paginationList);

                el.setAttribute('data-active', '');
                paginationList[i].setAttribute('data-active', '');

                setImgOffset(accordionItems, el);
            })
        })
    }

    const setEventHadler = () => {
        const accordionItems = document.querySelectorAll('.custom-accordion-item');
        const paginationList = document.querySelectorAll('.pagination-item');

        paginationList.forEach((el, i) => {
            el.addEventListener('pointerdown', () => {
                removeActivePagination(paginationList);
                removeActive(accordionItems);

                el.setAttribute('data-active', '');
                accordionItems[i].setAttribute('data-active', '');

                setImgOffset(accordionItems, accordionItems[i]);
            })
        })
    }


    const setImgOffset =(list, el) => {
        const parentContainer = document.querySelector('.custom-accrodion-list');
        const body = el.querySelector('.custom-accordion-body');
        const header = el.querySelector('.custom-accordion-header');
        const parentContainerWidth = parentContainer.clientWidth;
        const quantity = list.length;
        const figure = el.querySelector('figure');
        const headerWidth = header.clientWidth;

        const startWIdth = `${0}px`;
        const width = `${parentContainerWidth - headerWidth * quantity}px`;
        parentContainer.style.width = parentContainerWidth;
        body.style.width = width;

        figure.style.width = `${parentContainerWidth - headerWidth * quantity + headerWidth}px`;;

    }

    const removeActivePagination = (list) => {
        list.forEach((el) => {
            if(el.hasAttribute('data-active')) {
                el.removeAttribute('data-active');
            }
        })
    }

    const removeActive = (list) => {
        list.forEach((el) => {
            if(el.hasAttribute('data-active')) {
                const body = el.querySelector('.custom-accordion-body');
                body.style.width = `${0}`;
                el.removeAttribute('data-active');
            }
        })
    }


}('data-section-custom-accordion')); // set data-attribute



