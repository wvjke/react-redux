import { useHttp } from "../../hooks/http.hook";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filtersFetching, filtersFetched, filtersFetchingError, filterSetActive} from "../../actions";
import Spinner from "../spinner/Spinner";
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {

    const {filters, filtersLoadingStatus, activeFilter} = useSelector(state => state);
    const { request } = useHttp();
    const dispatch = useDispatch();

    useEffect(() => {
        
        dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()));
            
            // eslint-disable-next-line
    }, [])
    
    
    const filterHeroes = (filter) => {
        dispatch(filterSetActive(filter));
    }

    const renderFiltersList = (arr, activeFilter) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтров пока нет</h5>
        }

        return arr.map(({name, label, className}, i) => {
            if(activeFilter === name) {
                return <button onClick={() => filterHeroes(name)} key={i} name={name} className={`${className} active`}>{label}</button>
            } else {
                return <button onClick={() => filterHeroes(name)} key={i} name={name} className={className}>{label}</button>
            }
        })
    }


    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }


    const elements = renderFiltersList(filters, activeFilter);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;