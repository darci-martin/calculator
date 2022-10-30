export const PastCalculations = ({prevCalcs}) => {

    const calcsOutput = prevCalcs.map((prev, key) => {
        return (
        <div key={key}>{prev}</div>
        )}
    )

    return (<div className="prev">Past Calculations
        {calcsOutput}
    </div>
    )
}