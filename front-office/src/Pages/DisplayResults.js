import React, {StyleSheet} from 'react'
import Filter from "../Components/Filter"
import Product_Display from '../Components/Product_Display';
import './DisplayResults.css'


class DisplayResults extends React.Component {
    constructor(props) 
    {
        super(props);
        let products =  [
            {
                 "_id": 0,
                 "name": "Chicken Feet Dog Treats \u2013 Special Price!*",
                 "img": "https://media.mediazs.com/bilder/8/140/1322020_8.jpg",
                 "tag": "food",
                 "animal": "dog",
                 "price": "2.19",
                 "description": "Now when you buy selected Chicken Feet Dog Treats, a crispy treat for chewing fun between meals, with important fatty acids for a glossy coat, you'll get them for a Special Price!"
            },
            {
                 "_id": 1,
                 "name": "Dog Poop Bags - Black",
                 "img": "https://media.mediazs.com/bilder/2/140/54350_pla_hundekotbeutel_schwarz_ret_01_2.jpg",
                 "tag": "healthcare",
                 "animal": "dog",
                 "price": "2.29",
                 "description": "Dog poop bags to refill conventional dog poop bag dispensers. Poop bags are the easy, hygienic way to dispose of dog mess."
            },
            {
                 "_id": 2,
                 "name": "12kg Concept for Life Dry Dog Food - 10 + 2kg Free!*",
                 "img": "https://media.mediazs.com/bilder/9/140/1222054_9.jpg",
                 "tag": "food",
                 "animal": "dog",
                 "price": "4.29",
                 "description": "Now when you buy selected 12kg bags of Concept for Life dry dog food in a range of flavours and with tailored recipes, you'll only pay for 10kg, that's 2kg free!"
            },
            {
                 "_id": 3,
                 "name": "150g Briantos FitBites Dog Treats - Special Price!*",
                 "img": "https://media.mediazs.com/bilder/2/140/1220511_2.jpg",
                 "tag": "food",
                 "animal": "dog",
                 "price": "8.99",
                 "description": "Now when you buy selected 150g pouches of Briantos FitBites dog treats, the tasty, crunchy treats with varieties for adult, junior and senior dogs, you'll pay a special low price!"
            },
            {
                 "_id": 4,
                 "name": "50g/70g Rosie's Farm Dog Treats - Special Price!*",
                 "img": "https://media.mediazs.com/bilder/7/140/1186969_7.jpg",
                 "tag": "food",
                 "animal": "dog",
                 "price": "39.49",
                 "description": "Now when you buy selected 50g or 70g packs of Rosie's Farm dog snacks, rich in meat and with both adult and puppy varieties, you'll pay a\u00a0special low price!"
            },
            {
                 "_id": 5,
                 "name": "Biodegradable Dog Poop Bags with Handles",
                 "img": "https://media.mediazs.com/bilder/8/140/84807_heavy_duty_poop_bags_50bags_hs_04_8.jpg",
                 "tag": "healthcare",
                 "animal": "dog",
                 "price": "34.99",
                 "description": "Environmentally friendly dog poop bags made from maize starch, biodegradable and extra tear resistant, using a particularly thick and flexible material and useful handles."
            },
            {
                 "_id": 6,
                 "name": "12 x 400g Rosie's Farm Wet Dog Food - 10 + 2 Free!*",
                 "img": "https://media.mediazs.com/bilder/0/140/_1426540_0.jpg",
                 "tag": "food",
                 "animal": "dog",
                 "price": "33.29",
                 "description": "Now when you buy 12 x 400g of selected Rosie's Farm wet dog food cans, which is\u00a0nourishing, natural and gloriously grain-free, you'll only pay for 10 - that's 2\u00a0can free!"
            },
            {
                 "_id": 7,
                 "name": "2 x Lukullus Dog Bones - 1 + 1 Free!*",
                 "img": "https://media.mediazs.com/bilder/5/140/1221769_5.jpg",
                 "tag": "food",
                 "animal": "dog",
                 "price": "39.09",
                 "description": "Now when you buy 2x packs of selected Lukullus Dog Bones, small, low-fat chews made from meat or fish and pressed beef rawhide, you'll only pay for one - that's another pack free!"
            },
            {
                 "_id": 8,
                 "name": "12kg Greenwoods Adult Grain-Free Dry Dog Food - Save 5!*",
                 "img": "https://media.mediazs.com/bilder/1/140/1__1346198_1.jpg",
                 "tag": "food",
                 "animal": "dog",
                 "price": "36.19",
                 "description": "Now when you buy selected 12kg bags of Greenwoods dry dog food, you'll save 5!"
            },
            {
                 "_id": 9,
                 "name": "2 x 1kg Wolf of Wilderness Dry Dog Food - 10% Off!*",
                 "img": "https://media.mediazs.com/bilder/4/140/701475_4.jpg",
                 "tag": "food",
                 "animal": "dog",
                 "price": "1.79",
                 "description": "Now when you buy 2 x 1kg bags of selected Wolf of Wilderness grain-free dry dog food based on the wolf's natural diet, you'll get\u00a010% Off!"
            },
            {
                 "_id": 10,
                 "name": "Meaty Rolls with Chicken & Rice",
                 "img": "https://media.mediazs.com/bilder/5/140/fleischrollen_huhn_5.jpg",
                 "tag": "food",
                 "animal": "dog",
                 "price": "1.79",
                 "description": "Wholesome premium chew rolls with a tasty filling made from chicken and rice, wrapped in 100% beef gullet. Low-fat dog snack for between meals. Helps to strengthen your dog\u2019s jaw muscles."
            },
            {
                 "_id": 11,
                 "name": "12kg Purizon Grain-Free Dry Dog Food + Purizon Dog Snacks Free!*",
                 "img": "https://media.mediazs.com/bilder/8/140/_1449313_8.jpg",
                 "tag": "food",
                 "animal": "dog",
                 "price": "1.79",
                 "description": "Now when you buy selected 12kg bags of wholesome Purizon Grain-Free Dry Dog Food, in puppy, adult and senior varieties and a range of flavours and options, you'll get\u00a0Purizon Grain-Free Mix dog snacks free!"
            },
            {
                 "_id": 12,
                 "name": "Dog Overall Mint",
                 "img": "https://media.mediazs.com/bilder/9/140/73483_hundeoverall_mint_fg_1000px_2928_9.jpg",
                 "tag": "clothing",
                 "animal": "dog",
                 "price": "1.79",
                 "description": "Functional dog overalls with mid-length sleeves to offer all-round protection against wet, cold and dirt. It is light and comfortable, with fleece filling and drawstring to ensure it can be adjusted."
            },
            {
                 "_id": 13,
                 "name": "Premium Bavarian Pigs\u2019 Ears",
                 "img": "https://media.mediazs.com/bilder/5/140/premium_schweineohr_klein_5.jpg",
                 "tag": "food",
                 "animal": "dog",
                 "price": "1.99",
                 "description": "Premium-quality dried whole pigs\u2019 ears from Germany. Intense chewing fun for every dog. Satisfies your dog\u2019s need to chew and promotes good dental health."
            },
            {
                 "_id": 14,
                 "name": "Sports & Protective Dog Boots",
                 "img": "https://media.mediazs.com/bilder/3/140/52149_hundeschuhe_xs_fg_0839_ret_3.jpg",
                 "tag": "clothing",
                 "animal": "dog",
                 "price": "1.99",
                 "description": "Smart looking set of 4 protective dog boots, made from faux leather and polyester, with anti-slip profile and reflective Velcro fastening. A great way to protect your dog's paws. Colour: black"
            },
            {
                 "_id": 15,
                 "name": "12kg Wolf of Wilderness Dry Dog Food  + 180g Snacks Free!*",
                 "img": "https://media.mediazs.com/bilder/3/140/wow_redclassic_rubymidnight_frontright_12kg_1000x1000_7_1__3.jpg",
                 "tag": "food",
                 "animal": "dog",
                 "price": "1.69",
                 "description": "Now when you buy selected 12kg bags of Wolf of Wilderness dry food, species appropriate kibble made with lots of meat and enriched with berries, wild herbs and roots, you'll get\u00a0180g Snacks Free!"
            },
            {
                 "_id": 16,
                 "name": "Squeaky Ball Dog Toy",
                 "img": "https://media.mediazs.com/bilder/2/140/331033_squeaky_ball_01_08_2013_dsc0209_2.jpg",
                 "tag": "toy",
                 "animal": "dog",
                 "price": "1.69",
                 "description": "Green, squeaky dog ball, made from durable thermoplastic rubber (TPR), with a nubby surface which massages your dog's gums. Pleasant to hold, it floats and bounces. Great for water games!"
            },
            {
                 "_id": 17,
                 "name": "1kg DogMio Dog Snacks \u2013 Special Price!*",
                 "img": "https://media.mediazs.com/bilder/9/140/1371119_9.jpg",
                 "tag": "food",
                 "animal": "dog",
                 "price": "6.99",
                 "description": "Now when you buy selected 1kg DogMio Dog Biscuits, a tasty treat that helps to keep your dog's teeth clean, you'll get them for a special price!"
            },
            {
                 "_id": 18,
                 "name": "2 x 12kg Tigerino Canada / Premium Cat Litter - Special Price!*",
                 "img": "https://media.mediazs.com/bilder/7/140/999_7.jpg",
                 "tag": "healthcare",
                 "animal": "cat",
                 "price": "28.99",
                 "description": "Now when you buy 2 x 12kg bags of selected Tigerino Canada / Premium cat litter made from 100% natural clay, in a range of delightful scents, you'll get it for a great value\u00a0special price!"
            },
            {
                 "_id": 19,
                 "name": "Cat's Best Original Cat litter",
                 "img": "https://media.mediazs.com/bilder/0/140/20342_pla_catsbest_original_5l_hs_01_0.jpg",
                 "tag": "healthcare",
                 "animal": "cat",
                 "price": "28.99",
                 "description": "Clumping cat litter made from technologically refined active wood fibres, absorbent, natural and effective, with particularly high odour-binding properties and 100% compostable and biodegradable."
            },
            {
                 "_id": 20,
                 "name": "Cat Mate C200 2-Meal Automatic Feeder",
                 "img": "https://media.mediazs.com/bilder/6/140/313897_pla_closer_pets_futterautomat_c200_hs_05_6.jpg",
                 "tag": "healthcare",
                 "animal": "cat",
                 "price": "28.99",
                 "description": "Automatic feeder for cats & small dogs. With 2 x 400ml bowls for wet or dry food and a 48-hour timer. Battery operated and dishwasher safe."
            },
            {
                 "_id": 21,
                 "name": "Tigerino Crystals Clumping Cat Litter - Fresh/Baby Powder Scent",
                 "img": "https://media.mediazs.com/bilder/0/140/2_tigerino_crystal_babypowder_5l_ba_1000x1000_0.jpg",
                 "tag": "healthcare",
                 "animal": "cat",
                 "price": "28.99",
                 "description": "Baby powder scented clumping silicate litter  stops odours and can absorb up to 200%. This quick clumping litter is very economical. Tigerino Crystals, now available as a clumping cat litter."
            },
            {
                 "_id": 22,
                 "name": "3 x 400g Concept for Life Dry Cat Food - 2 + 1 Free!*",
                 "img": "https://media.mediazs.com/bilder/4/140/_1363517_4.jpg",
                 "tag": "food",
                 "animal": "cat",
                 "price": "28.99",
                 "description": "Now when you buy selected 3 x 400g Concept for Life Dry Cat Food, complete food with tasty fresh meat, antioxidants to help boost the body's defences, you'll only pay for 2 - that's 1 bag free!"
            },
            {
                 "_id": 23,
                 "name": "48 x 85g Concept for Life Wet Cat Food - 36 + 12 Free!*",
                 "img": "https://media.mediazs.com/bilder/6/140/689794_concept_for_life_36___12_free_6.jpg",
                 "tag": "food",
                 "animal": "cat",
                 "price": "19.49",
                 "description": "Now when you buy 48 x 85g pouches of selected Concept for Life Wet Cat Food, you'll only pay for 36 - that's 12 pouches free!"
            },
            {
                 "_id": 24,
                 "name": "Royal Canin Indoor Cat",
                 "img": "https://media.mediazs.com/bilder/4/140/rc_fhn_indoor27_mv_eretailkit__4.jpg",
                 "tag": "food",
                 "animal": "cat",
                 "price": "25.99",
                 "description": "A complete dry food for iadult ndoor cats, with an adapted calorie content and designed to reduce hairballs and stool odour, as well as promoting dental hygiene and healthy urinary tract."
            },
            {
                 "_id": 25,
                 "name": "Catsan Hygiene Plus Cat Litter",
                 "img": "https://media.mediazs.com/bilder/3/140/115096_pla_catsan_18l_katzenstreu_3.jpg",
                 "tag": "healthcare",
                 "animal": "cat",
                 "price": "7.89",
                 "description": "Specially developed for cat hygiene, a non-clumping litter with mineral protection and long-lasting odour binding effects, neither bleached nor scented, catches smells before they can spread."
            },
            {
                 "_id": 26,
                 "name": "36 x 85g Gourmet Gold Wet Cat Food - 24 + 12 Free!*",
                 "img": "https://media.mediazs.com/bilder/0/140/1393890_0.jpg",
                 "tag": "food",
                 "animal": "cat",
                 "price": "7.89",
                 "description": "Now when you buy 36 x 85g of selected Gourmet Gold, tasty wet cat food available in a range of flavours, you'll only pay for 24 - that's 12 cans free!"
            },
            {
                 "_id": 27,
                 "name": " Felix Cat Treats - 1 + 1 Free!*",
                 "img": "https://media.mediazs.com/bilder/0/140/1347638_0.jpg",
                 "tag": "food",
                 "animal": "cat",
                 "price": "7.29",
                 "description": "Now when you buy selected Felix Cat Treats - available in a range of tasty varieties, with appetising scent and irresistible flavour, you'll only pay for 1 - that's 1\u00a0pack free!\n\n\u00a0"
            },
            {
                 "_id": 28,
                 "name": "10kg Hill's Science Plan Dry Cat Food - 8kg + 2kg Free!*",
                 "img": "https://media.mediazs.com/bilder/5/140/994646_5.jpg",
                 "tag": "food",
                 "animal": "cat",
                 "price": "7.29",
                 "description": "Now when you buy selected 10kg bags of Hill's Science Plan dry cat food, high-quality with delicious protein to support health, you'll only pay for 8kg - that's 2kg free!"
            },
            {
                 "_id": 29,
                 "name": "Sound-Mouse Cat Toy",
                 "img": "https://media.mediazs.com/bilder/8/140/mai_mix_22_gedreht_8.jpg",
                 "tag": "toy",
                 "animal": "cat",
                 "price": "7.89",
                 "description": "Play rod with sensational sound chip"
            },
            {
                 "_id": 30,
                 "name": "Tigerino Crystals Cat Litter - Flower Scent",
                 "img": "https://media.mediazs.com/bilder/6/140/tigerino_crystal_flower_5l_ba_1000x1000_6.jpg",
                 "tag": "healthcare",
                 "animal": "cat",
                 "price": "27.79",
                 "description": "This super-absorbent cat litter is extremely efficient and has a pleasant floral scent! It inhibits bacterial growth so that your cat always has a fresh, dry litter tray. Dust-free and easy to use."
            },
            {
                 "_id": 31,
                 "name": "Applaws Cat Food 70g - Tuna / Fish",
                 "img": "https://media.mediazs.com/bilder/2/140/22657_PLA_Applaws_Katzenfutter_Thunfischfilet_70g_156g_2.jpg",
                 "tag": "food",
                 "animal": "cat",
                 "price": "27.79",
                 "description": "Supplementary premium moist food for cats in a lot of tasty varieties, with delicious fish flavours in 100% natural cat food without artificial preservatives, colours, or flavours."
            },
            {
                 "_id": 32,
                 "name": "Royal Canin Sensible 33 Cat",
                 "img": "https://media.mediazs.com/bilder/9/140/61227_pla_royalcanin_sensible33_9.jpg",
                 "tag": "food",
                 "animal": "cat",
                 "price": "27.79",
                 "description": "High-quality dry food for adult cats with sensitive digestive systems, for highest digestibility and improved wellbeing in a healthy recipe designed to promote a balanced intestinal flora."
            },
            {
                 "_id": 33,
                 "name": "6.5kg Purizon Dry Cat Food - Special Price!*",
                 "img": "https://media.mediazs.com/bilder/2/140/1344338_2.jpg",
                 "tag": "food",
                 "animal": "cat",
                 "price": "27.79",
                 "description": "Now you can buy selected 6.5kg bags of Purizon\u00a0grain-free dry cat food, in a range of delicious flavours, for a special low price!"
            },
            {
                 "_id": 34,
                 "name": "3 x 5l Tigerino Crystals Cat Litter - Special Price!*",
                 "img": "https://media.mediazs.com/bilder/0/140/281882_3x5l_tigerino_crystals__sonderpreis_sortenrein_0.jpg",
                 "tag": "healthcare",
                 "animal": "cat",
                 "price": "27.79",
                 "description": "Now when you buy 3 x 5l of selected Tigerino Crystals Cat Litter, that is eco-friendly and stops odours in seconds and seals germs in the core, you'll get it at a special low price!"
            },
            {
                 "_id": 35,
                 "name": "32 x 100g Rosie's Farm Wet Cat Food - 27 + 5 Free!*",
                 "img": "https://media.mediazs.com/bilder/0/140/1646755036004_img1_0.jpg",
                 "tag": "food",
                 "animal": "cat",
                 "price": "176.99",
                 "description": "Now when you buy selected 32 x 100g trays of Rosie's Farm, a range of nourishing, grain-free complete wet cat food made with lots of meat, you'll only pay for 27 - that's 5\u00a0trays free!"
            },
            {
                 "_id": 36,
                 "name": "Lillebro Fat Balls Wild Bird Food Saver Pack",
                 "img": "https://media.mediazs.com/bilder/2/140/606876_2.jpg",
                 "tag": "food",
                 "animal": "bird",
                 "price": "15.49",
                 "description": "Spoil your garden birds with these tasty fat balls!\u00a0Each box contains 100 balls, either in individual nets or without nets. Ragweed seed (ambrosia artemisiifolia) tested. Now in a mega saver pack!"
            },
            {
                 "_id": 37,
                 "name": "Lillebro Chopped Peanuts",
                 "img": "https://media.mediazs.com/bilder/4/140/62080_pla_lillebro_erdnuesse_gehackt_1_kg_4.jpg",
                 "tag": "food",
                 "animal": "bird",
                 "price": "4.69",
                 "description": "High quality peanuts - a valuable source of energy for wild birds all year round. Ideal for bird houses and balconies. No skin, no dusty leftovers."
            },
            {
                 "_id": 38,
                 "name": "Lillebro Husk-Free Sunflower Seeds - 10% Off!*",
                 "img": "https://media.mediazs.com/bilder/1/140/lillebro_1000x1000_2_9_1__1.jpg",
                 "tag": "food",
                 "animal": "bird",
                 "price": "20.99",
                 "description": "Now when you buy selected\u00a0Husk-free sunflower seeds as a valuable energy source for our feathered friends, ideally suited for year-round feeding, you'll get\u00a010% off!"
            },
            {
                 "_id": 39,
                 "name": "Lillebro Dried Mealworms",
                 "img": "https://media.mediazs.com/bilder/3/140/402290_lillebro_mehlwuermer_3.jpg",
                 "tag": "food",
                 "animal": "bird",
                 "price": "3.49",
                 "description": "Vital animal proteins for year-round feeding of wild birds, ideal for mixing with other feeds."
            },
            {
                 "_id": 40,
                 "name": "Lillebro Sunflower Seeds for Wild Birds",
                 "img": "https://media.mediazs.com/bilder/0/140/lillebro_sack_sbk_1kg_rot_0.jpg",
                 "tag": "food",
                 "animal": "bird",
                 "price": "6.79",
                 "description": "Striped sunflower seeds for wild birds. These energy-rich, premium quality seeds are perfect for feeding overwintering birds."
            },
            {
                 "_id": 41,
                 "name": "Lillebro Wild Bird Food",
                 "img": "https://media.mediazs.com/bilder/4/140/230762_lillebro_wildvogelf2_4.jpg",
                 "tag": "food",
                 "animal": "bird",
                 "price": "19.19",
                 "description": "Premium wild bird food for all-year feeding. Made with a variety of grains, seeds and energy-rich nuts. Species appropriate; ragweed seed (ambrosia artemisiifolia) tested."
            },
            {
                 "_id": 42,
                 "name": "Orlux Fruity Patee Concentrated Feed",
                 "img": "https://media.mediazs.com/bilder/1/140/13066_PLA_Versele_Orlux_FRUTTI_PATEE_Kraftfutter_250g_1.jpg",
                 "tag": "food",
                 "animal": "bird",
                 "price": "5.99",
                 "description": "Concentrated feed specially developed for seed-eating budgies/small parakeets, canaries, and exotics. To meet the high energy requirements of these birds."
            },
            {
                 "_id": 43,
                 "name": "Menu Nature Clean Garden Mix",
                 "img": "https://media.mediazs.com/bilder/1/140/77975_pla_menu_nature_clean_2_5kg_1.jpg",
                 "tag": "food",
                 "animal": "bird",
                 "price": "4.29",
                 "description": "Nutritionally balanced year-round feed for wild birds, free from shells and containing quality seeds such as sunflower seeds, peanuts and oats, perfect for creating a clean environment."
            },
            {
                 "_id": 44,
                 "name": "JR Birds Individual Lovebird/African Parrot Food",
                 "img": "https://media.mediazs.com/bilder/6/140/25387_jr_individual_agaporniden_6.jpg",
                 "tag": "food",
                 "animal": "bird",
                 "price": "1.99",
                 "description": "JR Birds Individual Lovebird/African Parrot Food is a premium complete diet for these affectionately named \u201cdwarf parrots\u201d with a balanced mix of seeds and valuable vitamins"
            },
            {
                 "_id": 45,
                 "name": "JR Birds Pick \u2018n\u2018 Fun Large Parakeets and Parrots",
                 "img": "https://media.mediazs.com/bilder/8/140/34318_pick_n_fun_gro__papa_8.jpg",
                 "tag": "food",
                 "animal": "bird",
                 "price": "5.29",
                 "description": "JR Birds Pick \u2018n\u2018 Fun Large Parakeets and Parrots - A chunky nibble stick from JR, hardwood with a wholemeal mix of various seeds.\r\nTo hang in the cage \u2013 size: approx 11.5 cm"
            },
            {
                 "_id": 46,
                 "name": "Cuttlebone with Mount",
                 "img": "https://media.mediazs.com/bilder/0/140/173396_pla_trixie_sepiaschale_mithalter_0.jpg",
                 "tag": "healthcare",
                 "animal": "bird",
                 "price": "7.79",
                 "description": "Indispensable for healthy birds."
            },
            {
                 "_id": 47,
                 "name": "Lillebro Fat Ballsnew ",
                 "img": "https://media.mediazs.com/bilder/2/140/lillebro_meisenknoedel_1_web_2.jpg",
                 "tag": "food",
                 "animal": "bird",
                 "price": "13.49",
                 "description": "Top-quality fat balls in a handy six-pack.\u00a0 Each fat ball is loosely enclosed in a net and provides energy-rich fats, seeds and minerals for wild birds. Ragweed seed (ambrosia artemisiifolia) tested."
            },
            {
                 "_id": 48,
                 "name": "Lillebro Husk-Free Sunflower Seeds",
                 "img": "https://media.mediazs.com/bilder/9/140/lillebro_1000x1000_2_9.jpg",
                 "tag": "food",
                 "animal": "bird",
                 "price": "13.89",
                 "description": "Husk-free sunflower seeds as a valuable energy source for our feathered friends. Ideally suited for year-round feeding."
            },
            {
                 "_id": 49,
                 "name": "10 x 500g Lillebro XXL Fat Balls - 8 + 2 Free!*",
                 "img": "https://media.mediazs.com/bilder/8/140/721648_8.jpg",
                 "tag": "food",
                 "animal": "bird",
                 "price": "11.29",
                 "description": "Now you can buy 10 x 500g of selected Lillebro XXL Fat Balls and you will only have to pay for 8, that's\u00a02 for free!"
            },
            {
                 "_id": 50,
                 "name": "JR Birds Foxtail Millet, Yellow",
                 "img": "https://media.mediazs.com/bilder/1/140/367_10846_pla_jrfarm_kolbenhirse_gelb_9_1.jpg",
                 "tag": "food",
                 "animal": "bird",
                 "price": "6.79",
                 "description": "Tasty and easy to digest supplement for all ornamental birds. Attaches easily to the cage with a clip or clothes peg. Your bird will love nibbling and picking at the seed."
            },
            {
                 "_id": 51,
                 "name": "JR Birds Individual Cockatiel Food",
                 "img": "https://media.mediazs.com/bilder/2/140/52287_jr_individual_nymphensittich_2.jpg",
                 "tag": "food",
                 "animal": "bird",
                 "price": "4.99",
                 "description": "High quality enriched seed mixture for cockatiels and parakeets from JR Farm, with carrots, oyster shells, berries, flowers and grass seeds - extra tasty and species-appropriate!"
            },
            {
                 "_id": 52,
                 "name": "JR Birds Natural Gourmet String",
                 "img": "https://media.mediazs.com/bilder/6/140/37081_schlemmerkette_6.jpg",
                 "tag": "food",
                 "animal": "bird",
                 "price": "8.99",
                 "description": "Snack and play in one with this toy from JR Farm, made up of crackers and wood pieces strung on natural rope. This is a supplementary food suitable for canaries, budgies and parrots"
            },
            {
                 "_id": 53,
                 "name": "Lillebro Coconut Shells with Bird Food",
                 "img": "https://media.mediazs.com/bilder/0/140/lillebro_filled_coconuts_enhanced_3_0.jpg",
                 "tag": "food",
                 "animal": "bird",
                 "price": "14.79",
                 "description": "3 filled coconut shells, each filled with either sunflower seeds, nuts or dried mealworms, approx. 600g, with practical loops, easy to hang up, enjoyed by birds that eat grain and insects"
            }
       ];
        this.state={
            screenWidth: window.innerWidth,
            products: products,
            productsDisplayed: products
        }
    }

    handleResize = () =>{
        this.setState({screenWidth: window.innerWidth});
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    renderProducts = () => {
        return this.state.productsDisplayed.map((product, i)=>{
            return <Product_Display product={product} key={i} />;
        })
    }

    render() {
        return (
            <div className="container displayResult">
                <Filter />
                <div className="products">
                    {this.renderProducts()}
                </div>
            </div>
        )
    }
}

export default DisplayResults;