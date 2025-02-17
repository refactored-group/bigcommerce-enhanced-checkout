let FFLConfigs = {
    storefrontApiToken: window.FFLStorefrontApiToken,
    checkoutId: window.FFLCheckoutId,
    googleMapsKey: window.FFLGoogleMapsKey,
    storeHash: null,
    isGuestUser: true,
    preventSubmition: false,
    preventSubmitionMessage: 'Please complete the FFL selection.',
    isEnhancedCheckoutEnabled: false,
    statesRequireAmmoFFL: [],
    ammoOnlyRequireFFLMessage: 'You have selected a state where ammunition must be shipped to an FFL holder.',
    ammoOnlyAddressChangedMessage: 'The shipping address has been updated. Please update the FFL holder.',
    ammoOnlyNoAddressRequiredMessage: 'The selected ammunition products do not require shipping to an FFL holder and will be sent to your provided shipping address.',
    ammoRequireFFL: false,
    ammoRequireFFLMessage: 'Your ammunition products will be shipped to this FFL holder due to the requirements of the selected state.',
    selectedDealer: null,
    hasNonFFLProducts: false,
    platform: 'BigCommerce',
    automaticFFLStoreInfoEndpointUrl: 'https://app-stage.automaticffl.com/store-front/api/stores/',
    // automaticFFLIframeUrl: 'https://automaticffl.pages.dev',
    automaticFFLIframeUrl: 'http://localhost:3000',
    previousAddressState: null,
    shippingAddressReferenceMessage: 'This shipping address is for reference only. All items will be shipped directly to the designated FFL dealer.',
    shippingAddressMixedCartMessage: 'Items not requiring an FFL will be shipped directly to this address. Items requiring an FFL will be shipped to the designated FFL dealer.',
    hasAmmoOnlyMessageDisplayed: false,
    css: `.ffl-section .alertBox--font-color-black {
          color: #000;
          border-radius: 3px;
      }
      .consignment {
          display: flex;
          flex-direction: row;
          margin: .75rem 0 1.5rem;
          width: 100%;
      }
      .consignment-product-figure {
          padding: 0 1.5rem 0;
          width: 25%;
      }
      .consignment-product-body {
          display: flex;
          flex-direction: column;
          width: 100%;
      }
      .consignment-product-body h5 {
          margin-bottom: .1875rem;
      }
      #ffl-message, #ffl-message-iframe {
         display: none;
         background-color: black;
      }
      #ffl-message-alert-modal {
         @media (min-width: 600px) {
             width: 470px;
         }
         display: none;
         visibility: visible;
         padding: 20px 20px 0 20px;
         text-align: center;
      }
      #ffl-message-alert-modal .modal-content {
        padding-bottom: 20px;
      }
      #ffl-message-alert-modal .modal-alert-icon {
        width: 76px;
        height: 76px;
        margin: 1.25em auto 1.875em;
      }
      #ffl-message-iframe-modal {
        display: none;
        width: 100%;
        height: 100%;
        visibility: visible;
        transform: scale(1) translateY(-50%);
        max-width: 85%;
        max-height: 85%;
        overflow: visible;
        @media (max-width: 551px) {
          transform: none;
          max-width: 100%;
          min-height: initial;
          bottom: 0;
          max-height: 90%;
          height: 90%;
          top: initial;
        }
      }
      #ffl-message-iframe-close {
        width: 22px;
        position: absolute;
        right: 0;
        margin: -10px;
        cursor: pointer;
        @media (max-width: 551px) {
          margin: -13px 5px;
        }
      }
      #ffl-message-iframe-modal .modal-content {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 6px;
        @media (max-width: 551px) {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
      }
      #alertDeliveryInfo {
        background-color: #feffd7;
        padding: 13px 20px;
        width: 100%;
        margin-bottom: 15px;
        border-radius: 3px;
      }`
}

let filteredProducts = {
    fireArm: [],
    ammo: []
};

const htmlTemplates = {
    fflStep: `<div class="checkout-view-header">
            <div class="stepHeader is-readonly">
                <div class="stepHeader-figure stepHeader-column">
                  <div class="icon stepHeader-counter optimizedCheckout-step">
                      <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                      </svg>
                  </div>
                  <h2 class="stepHeader-title optimizedCheckout-headingPrimary" id="shipping-ffl">Shipping FFL</h2>
                </div>
            </div>
          </div>
          <div aria-busy="false" class="checkout-view-content checkout-view-content-enter-done">
            <section class="ffl-section checkout-form" style="">
                <div>
                  <div id="ffl-alert" class="alertBox alertBox--error alertBox--font-color-black">
                      %items%
                      %fflInfo%
                  </div>
                  <div class="form-action"><button type="button" class="button button--primary optimizedCheckout-buttonPrimary" id="ffl-select-dealer" onclick="showFFLDealerModal(true)">SELECT YOUR DEALER (FFL)</button></div>
                </div>
            </section>
          </div>`,
    fflInfo: `<div id="ffl-info" class="alertBox-column alertBox-message">
        <p>You have purchased an item that must be shipped to a Federal Firearms License holder (FFL).</p>
        <p>Before making a selection, contact the FFL and verify that they can accept your shipment prior to completing your purchase.</p>
      </div>`,
    fflItems: `<li>
        <div class="consignment ffl-item ffl-%product_type%" style="display: none">
            %product_image%
            <div class="consignment-product-body">
              <h5 class="optimizedCheckout-contentPrimary">%product_qty% x %product_name%</h5>
            </div>
        </div>
      </li>`,
    fflMessage: `<div id="ffl-message" class="modal-background"></div>
        <div id="ffl-message-alert-modal" class="modal modal--alert modal--small" tabindex="0">
            <div class="modal-alert-icon"><img src="${FFLConfigs.automaticFFLIframeUrl}/bigcommerce-alert-icon.svg" alt=""/></div>
            <div class="modal-content"></div>
            <div class="button-container">
                <button type="button" class="confirm button" onclick="hideMessage()">OK</button>
            </div>
            <div class="loadingOverlay" style="display: none;"></div>
        </div>`,
    fflModal: `<div id="ffl-message-iframe" class="modal-background"></div>
        <div id="ffl-message-iframe-modal" class="modal modal--alert modal--small" tabindex="0">
            <div id="ffl-message-iframe-close" onclick="hideFFLDealerModal()"><img src="${FFLConfigs.automaticFFLIframeUrl}/bigcommerce-close-icon.svg" alt=""/></div>
            <div class="modal-content">
                <iframe src="%url%" style="width: 100%; height: 100%; border: none;"></iframe>
            </div>
            <div class="loadingOverlay" style="display: none;"></div>
        </div>`,
    alertDeliveryInfo: `<div id="alertDeliveryInfo">%message%</div>`
};

const graphqlPayloads = {
    userInformationQuery: `
      query {
        customer {
          entityId
        }
      }
    `,
    siteSettingsQuery: `
      query {
        site {
          settings {
            storeHash
          }
        }
      }
    `,
    cartProductsQuery: `
      query {
        site {
          cart {
            lineItems {
              physicalItems {
                entityId
                productEntityId
                quantity
                name
                image {
                  url(width: 120)
                }
              }
              digitalItems {
                entityId
                productEntityId
                quantity
                name
                image {
                  url(width: 120)
                }
              }
              giftCertificates {
                entityId
              }
              customItems {
                entityId
              }
            }
          }
        }
      }
    `,
    productDetailsQuery: `
      query {
        site {
          products(entityIds: [%product_ids%]) {
            edges {
              node {
                id
                entityId
                customFields {
                  edges {
                    node {
                      name
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    shippingConsignmentsQuery: `
      query {
        site {
          checkout {
            shippingConsignments {
              address {
                address1
                city
                stateOrProvinceCode
                postalCode
                phone
                countryCode
              }
            }
          }
        }
      }
    `,
    shippingConsignmentsMutation: `
      mutation addCheckoutShippingConsignments($addCheckoutShippingConsignmentsInput: AddCheckoutShippingConsignmentsInput!) {
        checkout {
          addCheckoutShippingConsignments(input: $addCheckoutShippingConsignmentsInput) {
            checkout {
              entityId
              shippingConsignments {
                entityId
                availableShippingOptions {
                  entityId
                }
                selectedShippingOption {
                  entityId
                }
              }
            }
          }
        }
      }
    `
};

async function fetchGraphQLData(query, variables = {}) {
    try {
        const response = await fetch('/graphql', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FFLConfigs.storefrontApiToken}`
            },
            body: JSON.stringify({query, variables})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("FFL Shipment: Failed to fetch GraphQL data:", error);
        return null;
    }
}

/**
 * TODO: get the correct data for isEnhancedCheckoutEnabled and statesRequireAmmoFFL
 **/
async function initFFLConfigs() {
    FFLConfigs.storeHash = await getStoreHash();
    const url = FFLConfigs.automaticFFLStoreInfoEndpointUrl + FFLConfigs.storeHash;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        FFLConfigs.isEnhancedCheckoutEnabled = true;
        FFLConfigs.statesRequireAmmoFFL = data.ammo_states ?? ['AK', 'CA', 'CT', 'DC', 'HI', 'IL', 'MA', 'NY'];
    } catch (error) {
        console.error("FFL Shipment: Failed to fetch data:", error);
    }
}

async function checkIfGuestUser() {
    if (filteredProducts.fireArm.length === 0) {
        return;
    }
    const data = await fetchGraphQLData(graphqlPayloads.userInformationQuery);
    FFLConfigs.isGuestUser = !data.customer?.entityId;

    if (!FFLConfigs.selectedDealer) {
        backToCustomerCheckoutStep();
    }
}

async function getStoreHash() {
    const data = await fetchGraphQLData(graphqlPayloads.siteSettingsQuery);
    return data.site.settings.storeHash || null;
}

async function getCartProducts() {
    const data = await fetchGraphQLData(graphqlPayloads.cartProductsQuery);

    if (!data) return null;

    const physicalItems = data.site.cart.lineItems.physicalItems || [];
    const digitalItems = data.site.cart.lineItems.digitalItems || [];
    const giftCertificates = data.site.cart.lineItems.giftCertificates || [];
    const customItems = data.site.cart.lineItems.customItems || [];

    if (giftCertificates.length > 0 || customItems.length > 0) {
        FFLConfigs.hasNonFFLProducts = true;
    }

    return [...physicalItems, ...digitalItems];
}

async function getProductDetailsByIds(productIds) {
    const query = graphqlPayloads.productDetailsQuery.replace('%product_ids%', productIds);
    const data = await fetchGraphQLData(query);

    if (!data) return null;

    return data.site.products.edges.map(edge => edge.node);
}

async function getShippingConsignments() {
    const data = await fetchGraphQLData(graphqlPayloads.shippingConsignmentsQuery);
    return data?.site.checkout.shippingConsignments[0]?.address || null;
}

async function setShippingConsignments(dealerData) {
    const lineItems = [];

    filteredProducts.fireArm.forEach(product => {
        lineItems.push({
            lineItemEntityId: product.entityId,
            quantity: product.quantity
        });
    });

    filteredProducts.ammo.forEach(product => {
        lineItems.push({
            lineItemEntityId: product.entityId,
            quantity: product.quantity
        });
    });

    const variables = {
        addCheckoutShippingConsignmentsInput: {
            checkoutEntityId: FFLConfigs.checkoutId,
            data: {
                consignments: [
                    {
                        address: {
                            firstName: "",
                            lastName: "",
                            company: dealerData.company,
                            address1: dealerData.address1,
                            city: dealerData.city,
                            stateOrProvince: dealerData.stateOrProvinceCode,
                            stateOrProvinceCode: dealerData.stateOrProvinceCode,
                            postalCode: dealerData.postalCode,
                            phone: dealerData.phone,
                            countryCode: dealerData.countryCode,
                            shouldSaveAddress: false
                        },
                        lineItems: lineItems
                    }
                ]
            }
        }
    };
    await fetchGraphQLData(graphqlPayloads.shippingConsignmentsMutation, variables);
}

async function initFFLProducts() {
    const products = await getCartProducts();
    if (!products || products.length === 0) {
        console.log("FFL Shipment: No product IDs found in the cart.");
        return;
    }

    const productIds = products.map(product => product.productEntityId);
    const productDetails = await getProductDetailsByIds(productIds);
    if (!productDetails) {
        console.log("FFL Shipment: Failed to retrieve product details.");
        return;
    }

    productDetails.forEach(productDetail => {
        const fflTypeField = productDetail.customFields.edges.find(field => field.node.name.toLowerCase() === 'ffl_type');
        const fflField = productDetail.customFields.edges.find(field => field.node.name.toLowerCase() === 'ffl');
        let fullProductData = null;

        if (fflTypeField || fflField) {
            const matchedProduct = products.find(prod => prod.productEntityId === productDetail.entityId);
            fullProductData = {...matchedProduct, ffl_type: fflTypeField ? fflTypeField.node.value.toLowerCase() : 'firearm'};
        }
        if (fflTypeField && fflTypeField.node.value.toLowerCase() === 'firearm') {
            filteredProducts.fireArm.push(fullProductData);
            return;
        } else if (fflTypeField && fflTypeField.node.value.toLowerCase() === 'ammo') {
            filteredProducts.ammo.push(fullProductData);
            return;
        } else if (fflField && fflField.node.value.toLowerCase() === 'yes') {
            filteredProducts.fireArm.push(fullProductData);
            return;
        }
        FFLConfigs.hasNonFFLProducts = true;
    });
}

async function addFFLCheckoutStep() {
    const checkoutSteps = document.querySelector('.checkout-steps');
    if (!checkoutSteps) {
        console.error("FFL Shipment: Checkout steps container not found.");
        return;
    }

    const itemsHTML = [...filteredProducts.fireArm, ...filteredProducts.ammo].map(product => {
        return htmlTemplates.fflItems
            .replace('%product_type%', product.ffl_type)
            .replace(
                '%product_image%',
                product.image?.url ? `<figure class="consignment-product-figure"><img alt="${product.name}" src="${product.image?.url}"></figure>` : '<div class="consignment-product-figure"></div>',
            )
            .replace('%product_qty%', product.quantity)
            .replace(/%product_name%/g, product.name);
    }).join('');

    let fflTemplate = htmlTemplates.fflStep.replace('%items%', itemsHTML)
        .replace('%fflInfo%', htmlTemplates.fflInfo);
    fflTemplate += htmlTemplates.fflModal.replace('%url%', `${FFLConfigs.automaticFFLIframeUrl}?store_hash=${FFLConfigs.storeHash}&platform=${FFLConfigs.platform}&maps_api_key=${FFLConfigs.googleMapsKey}`);
    const wrapperElement = document.createElement('li');
    wrapperElement.classList.add('checkout-step', 'optimizedCheckout-checkoutStep', 'checkout-step--shipping-ffl', 'ffl-items');
    wrapperElement.style.display = 'none';
    wrapperElement.innerHTML = fflTemplate;
    document.body.insertAdjacentHTML('beforeend', htmlTemplates.fflMessage);

    checkoutSteps.insertBefore(wrapperElement, checkoutSteps.firstChild);
    if (filteredProducts.fireArm.length > 0) {
        setFFLVisibility('firearm');
    }
}

async function showFFLAmmoOnlyHandler(shippingConsignments) {
    const state = shippingConsignments?.stateOrProvinceCode;
    const isSameAddress = isDealerAndShippingAddressSame(shippingConsignments)
    const hasAmmo = filteredProducts.ammo.length > 0;
    const ammoOnly = filteredProducts.fireArm.length === 0 && filteredProducts.ammo.length > 0 && !FFLConfigs.hasNonFFLProducts;
    const stateRequiresFFL = FFLConfigs.statesRequireAmmoFFL.includes(state)

    if (hasAmmo && state && stateRequiresFFL) {
        setFFLVisibility('ammo');
        if (!FFLConfigs.selectedDealer) {
            showMessage(FFLConfigs.ammoOnlyRequireFFLMessage);
        } else if(!isSameAddress && ammoOnly) {
            FFLConfigs.selectedDealer = false;
            const fflAlert = document.querySelector('#ffl-alert');
            fflAlert.classList.remove('alertBox--success');
            fflAlert.classList.add('alertBox--error');
            document.querySelector('#ffl-info').innerHTML = htmlTemplates.fflInfo;
            showMessage(FFLConfigs.ammoOnlyAddressChangedMessage);
        } else if (!ammoOnly && !FFLConfigs.hasAmmoOnlyMessageDisplayed) {
            FFLConfigs.hasAmmoOnlyMessageDisplayed = true;
            showMessage(FFLConfigs.ammoRequireFFLMessage)
        }
    } else if (hasAmmo && !isSameAddress && FFLConfigs.previousAddressState && FFLConfigs.previousAddressState !== state) {
        setFFLVisibility('ammo', 'none');
        showMessage(FFLConfigs.ammoOnlyNoAddressRequiredMessage);
    } else if (!isSameAddress) {
        setFFLVisibility('ammo', 'none');
    }
    FFLConfigs.previousAddressState = stateRequiresFFL ? state : null;
}

function isDealerAndShippingAddressSame(shippingAddress) {
    let dealerData = FFLConfigs.selectedDealer;
    if (!shippingAddress || !dealerData) return false;

    return shippingAddress.address1 === dealerData.address1 &&
        shippingAddress.city === dealerData.city &&
        shippingAddress.stateOrProvinceCode === dealerData.stateOrProvinceCode &&
        shippingAddress.postalCode === dealerData.postalCode &&
        shippingAddress.phone === dealerData.phone &&
        shippingAddress.countryCode === dealerData.countryCode;
}

function setFFLVisibility(productType, display = 'flex') {
    const fflItemsElement = document.querySelector('.ffl-items');
    if (filteredProducts.fireArm.length === 0 && productType === 'ammo' && display === 'none') {
        FFLConfigs.preventSubmition = false;
        FFLConfigs.ammoRequireFFL = false;
        fflItemsElement.style.display = 'none';
        return;
    }
    if (productType === 'ammo') {
        FFLConfigs.ammoRequireFFL = display === 'flex';
    }
    FFLConfigs.preventSubmition = true;
    fflItemsElement.style.display = 'block';
    document.querySelectorAll(`.ffl-item.ffl-${productType}`).forEach(function (element) {
        element.style.display = display;
    });
}

async function addAlertDeliveryInfo() {
    setTimeout(() => {
        handleAlertDeliveryInfo()
    }, 1000);
    const observer = new MutationObserver(() => {
        handleAlertDeliveryInfo()
    });
    const targetNode = await waitForElement('.checkout-step--shipping');
    observer.observe(targetNode, { childList: true });
}

function handleAlertDeliveryInfo() {
    let display = 'block', message;

    const hasFireArmProducts = filteredProducts.fireArm.length > 0;
    const hasAmmoProducts = filteredProducts.ammo.length > 0;
    const isMixedCart = FFLConfigs.hasNonFFLProducts && (hasFireArmProducts || (hasAmmoProducts && FFLConfigs.ammoRequireFFL));
    const isAmmoOnlyWithFFL = !FFLConfigs.hasNonFFLProducts && (!hasAmmoProducts || hasAmmoProducts && FFLConfigs.ammoRequireFFL);
    const isMixedAmmoAndFirearm = !FFLConfigs.hasNonFFLProducts && hasFireArmProducts && hasAmmoProducts && !FFLConfigs.ammoRequireFFL;

    if (isMixedCart || isMixedAmmoAndFirearm) {
        message = FFLConfigs.shippingAddressMixedCartMessage;
    } else if (isAmmoOnlyWithFFL) {
        message = FFLConfigs.shippingAddressReferenceMessage;
    } else {
        display = 'none';
    }

    const alertDeliveryInfoDiv = document.querySelector('#alertDeliveryInfo');
    if (alertDeliveryInfoDiv) {
        Object.assign(alertDeliveryInfoDiv.style, {display: display});
        alertDeliveryInfoDiv.textContent = message;
    } else if (display === 'block') {
        const content = htmlTemplates.alertDeliveryInfo.replace('%message%', message)
        let shippingForm = document.querySelector('.checkout-step--shipping .checkout-form');
        shippingForm.insertAdjacentHTML('beforebegin', content);
    }
}

function showFFLDealerModal(forceBackToCustomerCheckoutStep = false) {
    if (forceBackToCustomerCheckoutStep && FFLConfigs.isGuestUser && !FFLConfigs.hasNonFFLProducts) {
        backToCustomerCheckoutStep();
    }
    const alertBox = document.querySelector('#ffl-message-iframe');
    const alertBoxMessage = document.querySelector('#ffl-message-iframe-modal');
    Object.assign(alertBox.style, {display: 'block', opacity: '0.8'});
    Object.assign(alertBoxMessage.style, {display: 'block', opacity: '1'});
}

function hideFFLDealerModal() {
    const alertBox = document.querySelector('#ffl-message-iframe');
    const alertBoxMessage = document.querySelector('#ffl-message-iframe-modal');

    Object.assign(alertBox.style, {display: 'none', opacity: '0'});
    Object.assign(alertBoxMessage.style, {display: 'none', opacity: '0'});
}

async function handleDealerUpdate(event) {
    if (event?.data?.type === 'dealerUpdate') {
        FFLConfigs.selectedDealer = event.data.value;
        document.querySelector('#ffl-info').innerHTML = `<p>${event.data.value.addressFormatted}</p>`;
        FFLConfigs.hasAmmoOnlyMessageDisplayed = false;

        if (shouldSetShippingConsignments()) {
            await setShippingConsignments(event.data.value);
            backToShippingCheckoutStep();
        } else if (filteredProducts.ammo.length > 0) {
            let shippingConsignments = await getShippingConsignments();
            const state = shippingConsignments?.stateOrProvinceCode;

            if (FFLConfigs.statesRequireAmmoFFL.includes(state)) {
                setFFLVisibility('ammo');
                if (filteredProducts.fireArm.length > 0) {
                    showMessage(FFLConfigs.ammoRequireFFLMessage);
                }
            }
        }

        const fflAlert = document.querySelector('#ffl-alert');
        fflAlert.classList.add('alertBox--success');
        fflAlert.classList.remove('alertBox--error');

        document.querySelector('#ffl-select-dealer').innerText = 'CHANGE DEALER (FFL)';

        hideFFLDealerModal();
    }
}

async function handleAmmoOnlyProducts() {
    let shippingConsignments = await getShippingConsignments();
    const noFireArmItems = filteredProducts.fireArm.length === 0;

    if ((FFLConfigs.isGuestUser && noFireArmItems && shippingConsignments) ||
        (!FFLConfigs.isGuestUser && (noFireArmItems || shippingConsignments))) {
        showFFLAmmoOnlyHandler(shippingConsignments);
    }
}

async function setupPreventSubmissionObserver(targetSelector, buttonSelector, eventHandler) {
    const processedElements = new WeakSet();

    const observer = new MutationObserver(() => {
        const continueButton = document.querySelector(buttonSelector);
        if (continueButton && !processedElements.has(continueButton)) {
            const editButtons = document.querySelectorAll(".stepHeader.is-clickable");
            [continueButton, ...editButtons].forEach(element => {
                if (!processedElements.has(element)) {
                    element.addEventListener('click', async (event) => {
                        await eventHandler(event);
                    });
                    processedElements.add(element);
                }
            });
        }
    });

    const targetNode = await waitForElement(targetSelector);
    observer.observe(targetNode, { childList: true, subtree: true, attributes: true });
}

async function preventGuestUserSubmissionOnLogin() {
    const eventHandler = (event) => {
        if (!FFLConfigs.isGuestUser) return;

        const passwordInput = document.querySelector('.checkout-step--customer #password');
        if (passwordInput && passwordInput.offsetParent !== null) return;

        if (FFLConfigs.preventSubmition && !FFLConfigs.selectedDealer) {
            event.preventDefault();
            showMessage(FFLConfigs.preventSubmitionMessage);
        } else {
            setAddressData();
        }
    };

    await setupPreventSubmissionObserver(
        '.checkout-step--customer',
        '#checkout-shipping-continue',
        eventHandler
    );
}

async function preventSubmissionOnShipping() {
    const eventHandler = async () => {
        const shippingConsignments = await getShippingConsignments();
        showFFLAmmoOnlyHandler(shippingConsignments);
    };

    await setupPreventSubmissionObserver(
        '.checkout-step--shipping',
        '#checkout-shipping-continue',
        eventHandler
    );
}

async function preventSubmissionOnPayment() {
    const observer = new MutationObserver(() => {
        const element = document.querySelector("#checkout-payment-continue");
        if (element && !element.dataset.preventSubmissionEvent) {
            element.addEventListener('click', (event) => {
                if (FFLConfigs.preventSubmition && !FFLConfigs.selectedDealer) {
                    event.preventDefault();
                    setTimeout(() => {
                        document.getElementById("shipping-ffl").scrollIntoView();
                    }, 1000);
                    showMessage(FFLConfigs.preventSubmitionMessage);
                }
            });
            element.dataset.preventSubmissionEvent = "true";
        }
    });

    const targetNode = await waitForElement('.checkout-step--payment');
    observer.observe(targetNode, { childList: true, subtree: true, attributes: true });
}

function backToCustomerCheckoutStep() {
    const customerSelector = document.querySelector('.checkout-step--customer .stepHeader-actions button');
    if (FFLConfigs.isGuestUser && customerSelector) {
        customerSelector.click();
    }
}

function backToShippingCheckoutStep() {
    const shippingSelector = document.querySelector('.checkout-step--shipping .stepHeader-actions button');
    if (shippingSelector) {
        shippingSelector.click();
    }
}

async function setAddressData() {
    const observerProvinceCodeInput = new MutationObserver(() => {
        const province = document.querySelector('.checkout-step--shipping #provinceCodeInput');
        if (province && !province.value) {
            province.value = FFLConfigs.selectedDealer.stateOrProvinceCode;
            province.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
            observerProvinceCodeInput.disconnect();
        }
    });
    const observerSameAsBilling = new MutationObserver(() => {
        const sameAsBilling = document.querySelector('.checkout-step--shipping #sameAsBilling');
        if (sameAsBilling) {
            if (sameAsBilling.checked) {
                setTimeout(() => {
                    sameAsBilling.click();
                }, 500);
                observerSameAsBilling.disconnect();
            }
        }
    })

    const targetNode = await waitForElement('.checkout-step--shipping');
    observerProvinceCodeInput.observe(targetNode, { childList: true, subtree: true, attributes: true });
    observerSameAsBilling.observe(targetNode, { childList: true, subtree: true, attributes: true });
}

function shouldSetShippingConsignments() {
    return FFLConfigs.isGuestUser && !FFLConfigs.hasNonFFLProducts
}

function showMessage(message) {
    const alertBox = document.querySelector('#ffl-message');
    const alertBoxMessage = document.querySelector('#ffl-message-alert-modal');
    const alertBoxMessageContent = document.querySelector('#ffl-message-alert-modal .modal-content');
    Object.assign(alertBox.style, {display: 'block', opacity: '0.8'});
    Object.assign(alertBoxMessage.style, {display: 'block', opacity: '1'});

    alertBoxMessageContent.innerText = message;
}

function hideMessage() {
    const alertBox = document.querySelector('#ffl-message');
    const alertBoxMessage = document.querySelector('#ffl-message-alert-modal');

    Object.assign(alertBox.style, {display: 'none', opacity: '0'});
    Object.assign(alertBoxMessage.style, {display: 'none', opacity: '0'});
}

async function handleLoginOrLogout() {
    await checkIfGuestUser();
    const targetNode = await waitForElement('.checkout-step.optimizedCheckout-checkoutStep.checkout-step--customer');
    const observer = new MutationObserver(() => checkIfGuestUser());
    observer.observe(targetNode, {childList: true});
}

async function waitForElement(selector) {
    while (!document.querySelector(selector)) {
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    return document.querySelector(selector);
}

function addFFLStyle() {
    const style = document.createElement('style');
    style.textContent = FFLConfigs.css;
    document.head.append(style);
}

(async () => {
    if (!FFLConfigs.storefrontApiToken || !FFLConfigs.checkoutId) {
        console.error("FFL Shipment: Missing script params");
        return;
    }
    await initFFLProducts();
    if (filteredProducts.fireArm.length === 0 && filteredProducts.ammo.length === 0) {
        console.log("FFL Shipment: No FFL products in the cart.");
        return;
    }
    await initFFLConfigs();
    if (!FFLConfigs.isEnhancedCheckoutEnabled) {
        console.log("FFL Shipment: FFL is disabled.");
        return;
    }

    await handleLoginOrLogout();
    preventGuestUserSubmissionOnLogin();
    preventSubmissionOnPayment();
    addFFLStyle();
    await addFFLCheckoutStep();
    handleAmmoOnlyProducts();
    preventSubmissionOnShipping();
    addAlertDeliveryInfo();
    
    window.addEventListener('message', handleDealerUpdate);
})();